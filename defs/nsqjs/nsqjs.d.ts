// https://github.com/dudleycarr/nsqjs
//
///<reference path='../node/node.d.ts' />

declare module 'nsqjs'
{
    import * as events from "events";

    export class Reader extends events.EventEmitter
    {
        constructor( topic: string, channel: string, options?: ReaderOptions );

        //Connect to the nsqds specified or connect to nsqds discovered via lookupd.
        connect();

        //Disconnect from all nsqds. Does not wait for in-flight messages to complete.
        close();

        //Pause the Reader by stopping message flow. Does not affect in-flight messages.
        pause();

        //Unpauses the Reader by resuming normal message flow.
        unpause();

        //true if paused, false otherwise.
        isPaused(): boolean;

        //events
        static MESSAGE: string;
        static DISCARD: string;
        static ERROR: string;
        static NSQD_CONNECTED: string;
        static NSQD_CLOSED: string;
    }

    interface ReaderOptions
    {
        //The maximum number of messages to process at once. This value is shared between nsqd connections.
        //It's highly recommended that this value is greater than the number of nsqd connections.
        maxInFlight?: number;

        //The frequency in seconds at which the nsqd will send heartbeats to this Reader.
        heartbeatInterval?: number;

        //The maximum amount of time (seconds) the Reader will backoff for any single backoff event.
        maxBackoffDuration?: number;

        //The number of times to a message can be requeued before it will be handed to the DISCARD handler and then automatically finished. 0 means that there is no limit. If not DISCARD handler is specified and maxAttempts > 0, then the message will be finished automatically when the number attempts has been exhausted.
        maxAttempts?: number;

        //The default amount of time (seconds) a message requeued should be delayed by before being dispatched by nsqd.
        requeueDelay?: number;

        //A string or an array of string representing the host/port pair for nsqd instances.
        //For example: ['localhost:4150']
        nsqdTCPAddresses?: string | Array<string>;

        //A string or an array of strings representing the host/port pair of nsqlookupd instaces or the full HTTP/HTTPS URIs of the nsqlookupd instances.
        //For example: ['localhost:4161'], ['http://localhost/lookup'], ['http://localhost/path/lookup?extra_param=true']
        lookupdHTTPAddresses?: string | Array<string>;

        //The frequency in seconds for querying lookupd instances.
        lookupdPollInterval?: number;

        //The jitter applied to the start of querying lookupd instances periodically.
        lookupdPollJitter?: number;

        //Use TLS if nsqd has TLS support enabled.
        tls?: boolean;

        //Require verification of the TLS cert. This needs to be false if you're using a self signed cert.
        tlsVerification?: boolean;

        //Use zlib Deflate compression.
        deflate?: boolean;

        //Use zlib Deflate compression level.
        deflateLevel?: number;

        //Use Snappy compression.
        snappy?: boolean;

        //Authenticate using the provided auth secret.
        authSecret?: string;

        //The size in bytes of the buffer nsqd will use when writing to this client. -1 disables buffering. outputBufferSize >= 64
        outputBufferSize?: number;

        //The timeout after which any data that nsqd has buffered will be flushed to this client. Value is in milliseconds. 1 <= outputBufferTimeout. A value of -1 disables timeouts.
        outputBufferTimeout?: number;

        //Sets the server-side message timeout in milliseconds for messages delivered to this client.
        messageTimeout?: number;

        //Deliver a percentage of all messages received to this connection. 1 <= sampleRate <= 99
        sampleRate?: number;

        //An identifier used to disambiguate this client.
        clientId?: string;
    }

    export class Message
    {
        //Numeric timestamp for the Message provided by nsqd.
        timestamp: number;

        //The number of attempts that have been made to process this message.
        attempts: number;

        //The opaque string id for the Message provided by nsqd.
        id: string;

        //Boolean for whether or not a response has been sent.
        hasResponded: boolean;

        //The message payload as a Buffer object.
        body: Buffer;

        //Parses message payload as JSON and caches the result.
        json();

        //Returns the amount of time until the message times out. If the hard argument is provided, then it calculates the time until the hard timeout when nsqd will requeue inspite of touch events.
        timeUntilTimeout(hard?: boolean): number;

        //Finish the message as successful.
        finish();

        //The delay is in seconds. This is how long nsqd will hold on the message before attempting it again. The backoff parameter indicates that we should treat this as an error within this process and we need to backoff to recover.
        requeue(delay?: number, backoff?: boolean);

        //Tell nsqd that you want extra time to process the message. It extends the soft timeout by the normal timeout amount.
        touch()
    }

    export class Writer extends events.EventEmitter
    {
        constructor( nsqdHost:string, nsqdPort:number, options?: WriterOptions );

        //Connect to the nsqd specified.
        connect();

        //Disconnect from the nsqd.
        close();

        //topic is a string.
        //msgs is either a string, a Buffer, JSON serializable object, a list of strings / Buffers / JSON serializable objects.
        //callback takes a single error argument..
        publish(topic: string, msgs: any, callback: Function);

        //events
        static READY: string;
        static CLOSED: string;
        static ERROR: string;
    }

    interface WriterOptions
    {
        //Use TLS if nsqd has TLS support enabled.
        tls?: boolean;

        //Require verification of the TLS cert. This needs to be false if you're using a self signed cert.
        tlsVerification?: boolean;

        //Use zlib Deflate compression.
        deflate?: boolean;

        //Use zlib Deflate compression level.
        deflateLevel?: number;

        //Use Snappy compression.
        snappy?: boolean;

        //An identifier used to disambiguate this client.
        clientId?: string;
    }
}
