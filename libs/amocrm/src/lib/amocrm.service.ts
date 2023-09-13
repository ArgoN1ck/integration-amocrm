import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  map,
  tap,
  throwError,
} from 'rxjs';

import { AMOCRM_MODULE_OPTIONS } from './amocrm.constants';
import { AmocrmConfig } from './configs';
import {
  CreateContactDto,
  CreateLeadDto,
  GetContactDto,
  MakeLeadDto,
  UpdateContactDto,
} from './dtos';

@Injectable()
export class AmocrmService {
  private logger = new Logger(AmocrmService.name);
  private url: string;
  private clientSecret: string;
  private clientId: string;
  private redirectUrl: string;

  private token$ = new BehaviorSubject<string>('');

  constructor(
    @Inject(AMOCRM_MODULE_OPTIONS) private readonly config: AmocrmConfig,
    private readonly httpClient: HttpService
  ) {
    this.url = config.baseUrl;
    this.clientSecret = config.secret;
    this.clientId = config.integrationId;
    this.redirectUrl = config.redirectUrl;

    httpClient.axiosRef.interceptors.request.use(
      (request: InternalAxiosRequestConfig<any>) => {
        request.headers.setAuthorization(`${this.token$.value}`);
        this.logger.log(`AmoCRM token: ${request.headers.getAuthorization()}`);

        return request;
      },
      (error) => {
        this.logger.error(error);
        throw error;
      }
    );
  }

  makeLead(makeLeadDto: MakeLeadDto) {
    const { email, name, phone, price } = makeLeadDto;

    return this.getContact({ email, name, phone }).pipe(
      concatMap((data) => {
        if (data && data.length === 0) {
          return this.createContact({ email, name, phone }).pipe(
            concatMap((data) =>
              this.createLead({
                contactId: +data._embedded.contacts[0]['id'],
                price,
              })
            )
          );
        }
        return this.updateContact({ email, name, phone }).pipe(
          concatMap((data) =>
            this.createLead({
              contactId: +data._embedded.contacts[0]['id'],
              price,
            })
          )
        );
      })
    );
  }

  getContact(getContactDto: GetContactDto) {
    const { email, name, phone } = getContactDto;

    return this.httpClient
      .get(
        `${this.url}/api/v3/contacts?filter[name]=${name}&filter[custom_fields_values][EMAIL]=${email}&filter[custom_fields_values][PHONE]=${phone}`
      )
      .pipe(
        map((response) => response.data || []),
        catchError((err) => this.handleError(err))
      );
  }

  createContact(data: CreateContactDto) {
    const { email, name, phone } = data;

    const body = [
      {
        name,
        custom_fields_values: [
          {
            field_name: 'Email',
            field_code: 'EMAIL',
            values: [{ value: email }],
          },
          {
            field_name: 'Телефон',
            field_code: 'PHONE',
            values: [{ value: phone }],
          },
        ],
      },
    ];

    return this.httpClient.post(`${this.url}/api/v4/contacts`, body).pipe(
      map((response) => this.mapResponse(response)),
      catchError((err) => this.handleError(err))
    );
  }

  updateContact(updateContactDto: UpdateContactDto) {
    const { email, name, phone } = updateContactDto;

    return this.httpClient
      .patch(`${this.url}/api/v4/contacts`, { email, name, phone })
      .pipe(
        map((response) => this.mapResponse(response)),
        catchError((err) => this.handleError(err))
      );
  }

  createLead(createLeadDto: CreateLeadDto) {
    const { contactId, price } = createLeadDto;

    const body = [
      {
        name: `Lead for ${contactId} - ${new Date().getTime()}`,
        price,
        _embedded: {
          contacts: [
            {
              id: +contactId,
            },
          ],
        },
      },
    ];

    return this.httpClient.post(`${this.url}/api/v4/leads`, body).pipe(
      map((response) => this.mapResponse(response)),
      catchError((err) => this.handleError(err))
    );
  }

  setCode(code: string) {
    this.logger.log(`AmoCRM code: ${code}`);
    return this.getAuthToken(code);
  }

  private getAuthToken(code: string) {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl,
      grant_type: 'authorization_code',
      code,
    };

    return this.httpClient.post(`${this.url}/oauth2/access_token`, body).pipe(
      map((response) => this.mapResponse(response)),
      tap((data) => {
        this.token$.next(`${data?.token_type} ${data?.access_token}` as any);
      }),
      catchError((err) => this.handleError(err))
    );
  }

  private mapResponse(response: AxiosResponse) {
    if (response.status !== 200) {
      throw { response };
    }

    return response.data;
  }

  private handleError(err: any) {
    if (err.response) {
      const { response } = err;

      return throwError(
        () => new HttpException(response.statusText, response.status)
      );
    }

    return throwError(() => new InternalServerErrorException());
  }
}
