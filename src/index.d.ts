/** Types for @uphold/uphold-sdk-javascript as of July 9th, 2021
 * Use as your own risk, as these types are created by hand from someone outside of the Uphold organization.
 * This code is from https://gist.github.com/christopher-caldwell/3876f73632872b93aacad52301810852.
 */

 declare module '@uphold/uphold-sdk-javascript' {
  type HttpMethod = string // 'get' | 'post' | 'delete' | 'put' | 'patch'
  export interface SdkConstructorArgs {
    /** Key used to store the access token
     * @default uphold.access_token
     */
    accessTokenKey?: string
    /** Uphold API's url
     * @default https://api.uphold.com
     */
    baseUrl?: string
    /** Your client id */
    clientId: string
    /** Your client secret */
    clientSecret: string
    /** Pagination size
     * @default 10
     */
    itemsPerPage?: number
    /** Key used to store the refresh token
     * @default uphold.refresh_token
     */
    refreshTokenKey?: string
    /** Uphold API's version
     * @default v0
     */
    version?: string
  }

  /** The destination of a transaction has its own set of properties describing how the destination is affected
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#destination)
   */
  export interface Destination {
    /** The ID of the card credited. Only visible to the user who receives the transaction. */
    CardId: string
    /** The amount credited, including commissions and fees. */
    amount: string
    /** The amount to credit, before commissions or fees. */
    base: string
    /** The commission charged by Uphold to process the transaction. Commissions are only charged when currency is converted into a different denomination. */
    commission: string
    /** The denomination of the funds at the time they were sent/received. */
    currency: string
    /** The name of the recipient. In the case where money is sent via email, the description will contain the email address of the recipient. */
    description: string
    /** The Bitcoin network Fee, if destination is a BTC address but origin is not. */
    fee: string
    /** If the destination user has completed the membership process. */
    isMember: boolean
    /** The details about the transaction destination node. */
    node: {
      id: string
      type: string
      user: {
        id: string
      }
    }
    /** The rate for conversion between origin and destination, as expressed in the currency at destination (the inverse of origin.rate). */
    rate: string
    /** The type of endpoint.*/
    type: 'external' | 'email' | 'card'
  }

  /** The origin has properties regarding how the transaction affects the origin of the funds
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#origin)
   */
  export interface Origin extends Destination {
    /** The transactions where the value was originated from (id and amount). */
    sources: {
      amount: string
      id: string
    }[]
  }

  /** The actual value being transacted is denominated in a certain currency
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#denomination)
   */
  export interface Denomination {
    /** 	The amount to be transacted. */
    amount: string
    /** 	The currency for said amount. */
    currency: string
    /** 	The currency pair representing the denominated currency and the currency at origin. */
    pair: string
    /** 	The quoted rate for converting between the denominated currency and the currency at origin. */
    rate: string
  }

  /** The fees property contains an array of fees that were applied to the transaction
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#fees)
   */
  export interface Fee {
    /** The amount to be charged. */
    amount: string
    /** The currency for said amount. */
    currency: string
    /** The percentage amount to be charged. */
    percentage: string
    /** Can be origin or destination and determines where the fee was applied. */
    target: string
    /** The type of fee. Can be one of: deposit, exchange, network or withdrawal. */
    type: string
  }

  /** The params property associated with a transaction records additional meta data relating to the respective transaction
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#parameters)
   */
  export interface Parameters {
    /** The currency in which the total commission is expressed. */
    currency: string
    /** Uphold’s commission expressed in percentage. */
    margin: string
    /** The currency pair associated with any exchange that took place, if any. */
    pair: string
    /** In case a transaction is coming in from the outside, how many confirmations have been received. */
    progress: string
    /** The exchange rate of the transaction. */
    rate: string
    /** The time this quote is good for, in milliseconds. */
    ttl: number
    /** The type of the transaction. Possible values are deposit, transfer and withdrawal. */
    type: string
  }

  /** The normalized property contains the normalized amount and commission values in USD
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#normalized)
   */
  export interface Normalized {
    /** The amount to be transacted. */
    amount: string
    /** The total commission taken on this transaction, either at origin or at destination. */
    commission: string
    /** The currency in which the amount and commission are expressed. The value is always USD. */
    currency: string
    /** The normalized fee amount. */
    fee: string
    /** The exchange rate for this currency pair. */
    rate: string
    /** Can be origin or destination and determines where the fee was applied. */
    target: string
  }

  /** Transactions record the movement of value into, within and out of the Uphold network.
   * @note  There are two views of a transaction: public and private. The private view of information only privy to those who were a party to the transaction. Public views suppress and hide any private or personally identifiable information in order for Uphold to protect user privacy.
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#phone-object)
   */
  export interface TransactionObject {
    /** The application that created the transaction. */
    application: null // anything besides null?
    createdAt: string
    /** The funds to be transferred, as originally requested. */
    denomination: Denomination
    /** The recipient of the funds. */
    destination: Destination
    /** The fees that were applied to the transaction. */
    fees: Fee[]
    /** A unique ID on the Uphold Network associated with the transaction. */
    id: string
    /** An optional note added when initiating the transaction. Expected to be human-readable prose, e.g. for providing additional information and context about the nature/purpose of the transaction. */
    message: string | null
    /** The network of the transaction (uphold for internal transactions). */
    network: string
    /** The transaction details in USD */
    normalized: Normalized[]
    /** The sender of the funds. */
    origin: Origin
    /** Other parameters of this transaction. */
    params: Partial<Parameters>
    priority: string
    /** A reference code assigned to the transaction. Can be any string, up to 100 characters. This is not exposed to the user; a possible use case is to reference an external ID in another system. */
    reference: string | null
    /** The current status of the transaction. Possible values are: pending, processing, waiting, cancelled, failed and completed. */
    status: string
    /** The nature of the transaction. Possible values are deposit, transfer and withdrawal. */
    type: string
  }

  export interface ApiOptions {
    /** Whether or not to build the Authorization header */
    authenticate?: boolean
    body?: object
    headers?: Record<string, string>
    /** @default get */
    method?: HttpMethod
    queryParams?: Record<string, string>
    /** Resolve the whole .request() response */
    raw?: boolean
    /** API version or use a falsy value for endpoints without prefix
     * @default options.version
     */
    version?: string
  }

  export interface PaginationOptions extends PaginatorConstructorArgs {}

  /** @link [Doc](https://uphold.com/en/developer/api/documentation/#account-object) */
  export interface Account {
    /** The relevant billing details associated with the account. */
    billing: Record<string, string> // docs show `name` as the only example key
    /** The brand of the card account. */
    brand: string
    /** The currency in which the account is denominated. */
    currency: string
    /** A unique ID associated with the account. */
    id: string
    /** The display name of the account as chosen by the user. */
    label: string
    /** The current status of the account */
    status: 'ok' | 'failed'
    /** The type of the account. */
    type: 'card' | 'sepa'
  }

  export interface CardAddress {
    formats: {
      format: string
      value: string
    }[]
    type: string
  }

  /** @link [Doc](https://uphold.com/en/developer/api/documentation/#card-object) */
  export interface Card {
    /** A key/value pair representing the primary address for the card. */
    address: Record<string, string>
    /** The balance available for withdrawal/usage. */
    available: string
    /** The total balance of the card, including all pending transactions. */
    balance: string
    /** The currency by which the card is denominated. */
    currency: string
    id: string
    /** The display name of the card as chosen by the user. */
    label: string
    /** A timestamp of the last time a transaction on this card was conducted.
     * @example "2018-08-01T09:53:51.258Z";
     */
    lastTransactionAt: string
    /** Contains the normalized available and balance values in the currency set by the user in the settings. */
    normalized: [
      {
        available: string
        balance: string
        currency: string
      },
    ]
    /** Contains the card’s current position and whether the card is starred or not. */
    settings: {
      position: number
      protected: boolean
      starred: boolean
    }
  }

  /** @link [Doc](https://uphold.com/en/developer/api/documentation/#contact-object) */
  export interface Contact {
    /** An array of known addresses associated with this contact. */
    addresses: string[]
    /** The company of this contact provided by the user. */
    company: string
    /** An array of known email addresses associated with this contact. */
    emails: string[]
    /** The first name of this contact provided by the user. */
    firstName: string
    /** A unique ID in the Uphold network identifying the contact. */
    id: string
    /** The last name of this contact provided by the user. */
    lastName: string
    /** The display name of the contact created by joining the first and last names. */
    name: string
  }

  export interface ContactMutationPayload {
    /** A list of bitcoin addresses */
    addresses: string[]
    /** The company of affiliation */
    company: string
    /** A list of contact email addresses */
    emails: string[]
    firstName: string
    lastName: string
  }

  export interface UpdateMePayload {
    address: User['address']
    birthdate: string
    country: string
    firstName: string
    identity: Record<string, unknown>
    lastName: string
    settings: User['settings']
    state: string
    username: string
  }

  // No info on this in the docs
  export interface Document {}

  /**
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#phone-object)
   * @note For more information about the specifics of the “international” and “national” phone number formats, refer to the implementation of the google-libphonenumber package.
   */
  export interface Phone {
    id: string
    /** If this phone number has been verified. */
    verified: boolean
    /** If this phone number is the user’s primary phone number. */
    primary: boolean
    /** The masked representation of the phone number in the E.164 format. */
    e164Masked: string
    /** The masked representation of the phone number in national format. */
    nationalMasked: string
    /** The masked representation of the phone number in international format. */
    internationalMasked: string
  }

  /** To assist developers with tracking the overall status of our Reserve, we provide a summary of all the obligations and assets within it. Then for convenience’s sake we compute the value of each our holdings in all of the currencies we support, making it easy for example to display our total US dollar liabilities, but expressed in Euros. For example, a request to fetch a summary will return an array of assets with the following properties:
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#reserve-status)
   */
  export interface ReserveStatus {
    /** The asset class of the holding being summarized. */
    currency: string
    /** Expresses the value of held in the associated currency in all supported forms. */
    values: {
      /** The quantity of assets held for the corresponding holding, but converted to a different currency. */
      assets: string
      /** The currency we are computing the current holding in. */
      currency: string
      /** The rate we used when computing the holding to the corresponding currency. */
      rate: string
      /** The quantity of liabilities for the corresponding holding, but converted to a different currency. */
      liabilities: string
    }[]
    /** Lists the commissions, transaction volume, assets and liabilities. */
    totals: {
      amount: string
      count: string
      assets: string
      liabilities: string
    }
  }

  /** Our ledger provides a detailed record of the obligations (a.k.a. “liabilities”) flowing into our network via our members, and the resulting changes we as a company make to the assets in our reserve to secure the value of those obligations.
   *
   * The ledger is made up of “entries”, each of which contains information about the change to an asset, a liability, or both, and references the related transactions that affected the change whenever possible.
   *
   * Frequently one may find that changes to the Reserve’s assets and liabilities are not made in lock step with one another, and that the Reserve may accrue liabilities of one asset type or another, and then have those liabilities offset by a single change to the Reserve’s assets.
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#the-reserveledger)
   */
  export interface LedgerEntry {
    type: string
    out: {
      amount: string
      currency: string
    }
    in: {
      amount: string
      currency: string
    }
    TransactionId: string
    /** @example '2014-10-08T12:26:29.844Z' */
    createdAt: string
  }

  /** Developers can query at any time the rates we utilize when exchanging one form of value for another. These are expressed in [currency pairs](https://uphold.com/en/developer/api/documentation/#currency-pair-object).
   * @link [Doc]s(https://uphold.com/en/developer/api/documentation/#tickers)
   */
  export interface Ticker {
    ask: string
    bid: string
    currency: string
    pair: string
  }

  /** The user object contains most of the information we have on record relating to the currently logged in user.
   * @note Users are only permitted to access information about themselves. Our API does not allow accessing information about other users.
   * @link [Doc](https://uphold.com/en/developer/api/documentation/#user-object)
   */
  export interface User {
    address: {
      city: string
      line1: string
      line2: string
      zipCode: string
    }
    balances: {
      /** The key will be the all caps 3 character representation of the currency
       * @example ```{
       *    BTC: {...},
       *    USD: {...}
       * }```
       */
      currencies: Record<
        string,
        {
          amount: string
          balance: string
          currency: string
          rate: string
        }
      >
      total: string
    }
    /** @example '2000-09-27' */
    birthdate: string
    country: string
    currencies: string[]
    email: string
    firstName: string
    id: string
    lastName: string
    /** The date when the user became a verified member */
    memberAt: string | null
    name: string
    phones: [
      {
        e164Masked: string
        id: string
        internationalMasked: string
        nationalMasked: string
        primary: boolean
        verified: boolean
      },
    ]
    settings: {
      currency: string
      hasMarketingConsent: boolean
      hasNewsSubscription: boolean
      intl: {
        dateTimeFormat: {
          locale: string
        }
        language: {
          locale: string
        }
        numberFormat: {
          locale: string
        }
      }
      otp: {
        login: {
          /**  This will prompt the user to input an OTP token when creating an OAuth token. */
          enabled: boolean
        }
        transactions: {
          send: {
            /** This will prompt the user to input an OTP token when creating a transaction to another user. */
            enabled: boolean
          }
          transfer: {
            /** This will prompt the user to input an OTP token when transacting between the user’s own cards. */
            enabled: boolean
          }
          withdraw: {
            crypto: {
              /** This will prompt the user to input an OTP token when withdrawing to the bitcoin network. */
              enabled: boolean
            }
          }
        }
        vmc: {
          /** This will prompt the user to input an OTP token when using VMCs. */
          enabled: boolean
        }
      }
    }
    state: string
    /** We communicate a number of different user statuses through our API. At a high-level users can be in one of four statuses: */
    status: 'pending' | 'restricted' | 'blocked' | 'ok'
    type: string
    /** The verifications field can help communicate the reasons for a given user status, or what’s missing to complete the membership process. These verifications have permissible values and in some cases, an associated reason. Here is an overview of the verifications field: */
    verifications: Partial<{
      /** Whether the user needs to provide his/her date of birth. */
      birthdate: 'required'
      /** Whether the user needs to confirm his/her email. */
      email: 'uncomfirmed'
      /** The status of identity verification during membership application process. */
      identity: 'required' | 'retry' | 'review' | 'running'
      /** Whether the user has specified his/her location, which can be a blocked country/state.
       * @reason country, state
       */
      location: 'required' | 'blocked'
      /** The status of phone number verification. */
      phone: 'required' | 'unconfirmed'
      /** Whether the user has accepted the latest version of the terms of service.
       * @reason updated
       */
      terms: 'required'
    }>
  }

  /** This is the default class exported by this module, which when instantiated with your client id and secret offers an API to manage Uphold requests.
   * @example import SDK from '@uphold/uphold-sdk-javascript';
   *
   * const sdk = new SDK({
   *  baseUrl: 'http://api-sandbox.uphold.com',
   *  clientId: 'foo',
   *  clientSecret: 'bar'
   * });
   */
  class SDK {
    constructor(options: SdkConstructorArgs)

    options: SdkConstructorArgs
    client: Client
    storage: Storage
    oauthClient: OAuthClient
    /** Internal pointer to a refresh token request */
    refreshRequestPromise: Promise<string>
    /** Internal pointer to an access token request */
    tokenRequestPromise: Promise<string>

    /** This method handles Uphold API requests, and serves as basis for all actions.
     * It resolves the .request() response body property by default.
     */
    api: <TData>(uri: string, options?: ApiOptions) => Promise<TData>
    /** Performs a request to `POST` `/oauth2/token` with given code, storing access and refresh tokens on success. */
    authorize: (code: string) => Promise<void>
    /** Resolves an object containing the stored tokens. */
    getToken: () => Promise<Record<string, string>>
    /** Performs a request to `POST` `/oauth2/revoke`, removing tokens from storage on success. */
    logout: () => Promise<void>
    /** Performs a paginated request. */
    paginate: <TData>(
      url: string,
      /** @default 1 */
      page?: number,
      /** @default options.itemsPerPage */
      itemsPerPage?: number,
      options?: PaginationOptions,
    ) => Promise<Paginator<TData>>
    /** Removes tokens from storage */
    removeToken: () => Promise<void>
    /** Sets tokens in storage. */
    setToken: (token: {access_token: string, refresh_token?: string}) => Promise<void>

    // Action Methods
    /** Retrieves the details of an account. */
    getAccount: (accountId: string, options?: ApiOptions) => Promise<Account>
    /** Retrieves the accounts list. */
    getAccounts: (options?: ApiOptions) => Promise<Account[]>
    /** Create a network address for a card. */
    createCardAddress: (
      cardId: string,
      network: string,
      options?: ApiOptions,
    ) => Promise<{
      id: string
      network: string
    }>
    /** Retrieves a list of addresses associated with a card. */
    getCardAddresses: (
      cardId: string,
      options?: ApiOptions,
    ) => Promise<CardAddress[]>
    /** Cancels a transaction that has not yet been redeemed. */
    cancelCardTransaction: (
      cardId: string,
      transactionId: string,
      options?: ApiOptions,
    ) => Promise<TransactionObject>
    /** Commits a pending transaction.
     *
     * The otp argument will add the OTP-TOKEN header to the request
     */
    commitCardTransaction: (
      cardId: string,
      transactionId: string,
      body?: {
        /** Transaction details */
        message: string
        /** Credit card security code */
        securityCode: string
      },
      otp?: string,
      options?: ApiOptions,
    ) => Promise<TransactionObject>
    /** Creates a transaction, which can afterwards be committed by calling the `.commitCardTransaction()` action.
     *
     * The otp argument will add the OTP-TOKEN header to the request.
     *
     * The commit argument will add the commit query parameter. */
    createCardTransaction: (
      cardId: string,
      body?: Partial<{
        /** The value amount to send in the denominated currency */
        amount: string
        /** The currency by which you wish to denominate the transaction */
        currency: string
        /** The destination of the transaction, which can be in the form of a bitcoin address, an email address, an account id, an application id or an Uphold username */
        destination: string
        /** Transaction details */
        message: string
        /** Credit card security code */
        securityCode: string
      }>,
      commit?: boolean,
      otp?: string,
      options?: ApiOptions,
    ) => Promise<TransactionObject>
    /** Retrieves the list of transactions of a card. */
    getCardTransactions: (
      cardId: string,
      page?: number,
      itemsPerPage?: number,
      options?: ApiOptions,
    ) => Promise<Paginator<TransactionObject>>
    /** Triggers a reminder for a transaction that hasn’t yet been redeemed. */
    resendCardTransaction: (
      cardId: string,
      transactionId: string,
      options?: ApiOptions,
    ) => Promise<TransactionObject>
    /** Creates a card. */
    createCard: (
      currency: string,
      label: string,
      options?: ApiOptions,
    ) => Promise<Card>
    /** Retrieves a card's details. */
    getCard: (cardId: string, options?: ApiOptions) => Promise<Card>
    getCards: (
      page?: number,
      itemsPerPage?: number,
      options?: PaginationOptions,
    ) => Promise<Paginator<Card>>
    /** Updates a card.
     * @note Requires the cards:write scope for Uphold Connect applications.
     */
    updateCard: (
      cardId: string,
      label: string,
      options?: ApiOptions,
    ) => Promise<Card>
    /** Creates a contact */
    createContact: (
      requestBody: ContactMutationPayload,
      options?: ApiOptions,
    ) => Promise<Contact>
    /** Returns an associative array containing the details of a contact. */
    getContact: (contactId: string, options?: ApiOptions) => Promise<Contact>
    /** Returns the contacts list. */
    getContacts: (contactId: string, options?: ApiOptions) => Promise<Contact[]>
    /** Updates the details of a contact. */
    updateContact: (
      contactId: string,
      body: ContactMutationPayload,
      options?: ApiOptions,
    ) => Promise<Contact>
    /** Creates a document. */
    createDocument: (
      type: string,
      value: string,
      options?: ApiOptions,
    ) => Promise<Document>
    /** Returns the documents list. */
    getDocuments: (options?: ApiOptions) => Promise<Document[]>
    /** Returns the phones list. */
    getPhones: (options?: ApiOptions) => Promise<Phone>
    /** Retrieves the list of public transactions. */
    getReserveTransactions: (
      page?: number,
      itemsPerPage?: number,
      options?: PaginationOptions,
    ) => Promise<Paginator<TransactionObject>>
    /** Retrieves a public transaction's details. */
    getReserveTransaction: (
      transactionId: string,
      options?: ApiOptions,
    ) => Promise<TransactionObject>
    /** Returns a summary of all the obligations and assets within the Reserve. */
    getReserveStatistics: (options?: ApiOptions) => Promise<ReserveStatus>
    /** Returns a detailed record of the obligations/liabilities flowing into our network and the resulting changes to the assets. */
    getReserveLedger: (
      page?: number,
      itemsPerPage?: number,
      options?: PaginationOptions,
    ) => Promise<Paginator<LedgerEntry>>
    /** Retrieves the exchange rates for all supported currency pairs, or a particular one if `pair` is provided. */
    getTicker: (pair?: string, options?: ApiOptions) => Promise<Ticker | Ticker[]>
    /** Retrieves a transaction's details. */
    getTransaction: (
      transactionId: string,
      options?: ApiOptions,
    ) => Promise<TransactionObject>
    /** Retrieves the transactions list of the authenticated user. */
    getTransactions: (
      page?: number,
      itemsPerPage?: number,
      options?: PaginationOptions,
    ) => Promise<Paginator<TransactionObject>>
    /** Returns the details of the authenticated user. */
    getMe: (options?: ApiOptions) => Promise<User>
    /** Updates the authenticated user's details.
     *
     * The otp argument will add the OTP-TOKEN header to the request. */
    updateMe: (
      body: UpdateMePayload,
      otp: string,
      options?: ApiOptions,
    ) => Promise<User>
  }

  export interface PaginatorConstructorArgs {
    sdk: SDK
    uri: string
    itemsPerPage: number
    options?: ApiOptions
  }
  /** An instance of this class is returned in every action that requests an endpoint
   * that implements pagination, simplifying the construction and parsing of
   * Range and Content-Range headers.
   * @link [Doc](https://uphold.github.io/uphold-sdk-javascript/paginator.html)
   */
  export class Paginator<TData> {
    constructor(options: PaginatorConstructorArgs)

    /** The current page, considering the pagination size */
    currentPage: number
    /** Headers of the current page response */
    headers: Record<string, string>
    /** Current page items */
    items: TData[]
    /** Current page items count */
    itemsCount: number
    /** Pagination size */
    itemsPerPage: number
    /** Options passed to `.api()` method
     * @note The options property will be passed in any `.getPage()`, `.getNextPage()` and `.getPreviousPage()` methods to the underlying `.api()` call behind the hood, although you can override it in each of these methods or any other action that resolves a Paginator instance.
     */
    options: ApiOptions
    /** Number of pages */
    pagesCount: number
    sdk: SDK
    uri: string

    /** Resolves a Paginator instance for the next page or undefined if non-existent. */
    getNextPage: (options?: ApiOptions) => Promise<Paginator<TData> | undefined>
    /** Resolves a Paginator instance for the previous page or undefined if non-existent. */
    getPreviousPage: (
      options?: ApiOptions,
    ) => Promise<Paginator<TData> | undefined>
    /** Determines whether or not there is a next page. */
    hasNextPage: () => boolean
    /** Determines whether or not there is a previous page. */
    hasPreviousPage: () => boolean
    /** Resolves a Paginator instance for a specific page or undefined if non-existent.
     * @param {number} [page] Defaults to `1`
     */
    getPage: (
      page?: number,
      options?: ApiOptions,
    ) => Promise<Paginator<TData> | undefined>
  }

  /**
   * This class is responsible for performing HTTP requests to Uphold's API, being the browser version based on the Fetch API and the Node.js version based on request-promise.
   *
   * If you wish to extend the request handler with added functionality or if you don't like the idea of using a polyfill, you can simply override the client property and roll your own XHR client implementation.
   *
   * Pseudo-implementation of an alternative client
   * @link [Doc](https://uphold.github.io/uphold-sdk-javascript/client.html) */
  export class Client {
    constructor()

    defaultHeaders: Record<string, string>

    /** This method is responsible for performing HTTP requests to Uphold's API.
     * @argument {string} url - Full endpoint URL
     */
    request: <TData>(
      url: string,
      method: HttpMethod,
      body: Record<string, unknown>,
      headers: Record<string, string>,
    ) => Promise<TData>
  }

  export interface OAuthClientConstructorArgs {
    baseUrl: string
    clientId: string
    clientSecret: string
  }

  export interface RequestBody {
    body: string[]
    headers: Record<string, string>
    url: string
  }

  /** This class serves as a helper to build request objects for authorization related endpoints.
   * @link [Doc](https://uphold.github.io/uphold-sdk-javascript/oauthclient.html)
   */
  export class OAuthClient {
    clientId: string
    clientSecret: string
    headers: Record<string, string>
    /** Access token request url */
    requestUrl: string
    /** Revoke token request url */
    revokeUrl: string

    /** Builds an access token request with the authorization_code grant type. */
    buildAccessTokenRequestByAuthorizationCodeGrant: (
      code: string,
    ) => RequestBody
    /** Builds an access token request with the refresh_token grant type. */
    buildRefreshTokenRequest: (token: string) => RequestBody
    /** Builds a revoke token request. */
    buildRevokeTokenRequest: (token: string) => RequestBody
  }

  export default SDK
}