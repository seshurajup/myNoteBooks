 # [Messenger Platform](https://developers.facebook.com/docs/messenger-platform/introduction/integration-components)
 * **Page Scoped ID (PSID)**:
    * Unique to Facebook Page
    * recipient.id and sender.id 
* **Send API**:
    * Send simple text
        * Conversation must be initiated by the user.
        * **Standard Messaging**
            * Send Standard Messaging with in '24+1' policy after user opt-in to receive messages.
            * Need to send one message with in 24 hours
            * One additional message after the 24 hours
        * **Subscription Messaging**
            * News / Productivity / Personal trackers only these use cases are allowed for this messaging
        * **Sponsored Messaging**
            * Can be send outside the 24-hour window
        * messaging_type need to include in all messages
* **Recipient IDS**:
    * **Page-scoped ID (PSID)**:
        * bot communication, sender.id of message having PSID
    * **Phone number**:
        * recipient.phone_number in api request, will send message request to the recipient. ( No need to be interact with Facebook page first )
            * Need *pages_messaging_phone_number* permission
    * **Checkbox Plugin**:
        * user_ref
        * Active Opt-in - User need check box manually
        * Check box above button
        * Clear opt-in messaging for (marketing, promotions, informational etc)
    * **Batching Requests**:
        * 50 messages with a single API. 
        * 250 requests per second.
    * **Messenger Codes**:
        * Generate a static code
        * Generating a parametric code with ref string
            * Postback webhook will called if it is first time
            * Referral webhook will be called if it is re-entering
    * **messaging Insights Api**:
        * Same page insights 
            * keep spam and block rate low
    * **customer matching api**:
        * if we able to find the customer by phone number, first name and last name.. then you can use it for.
        * When he replied for your phone number conversation, we recieve PSID and will use PSID to continue conversation.
    * **Customer Matching with the Send API**:
        * Only available for bots that have U.S based admin for their Facebook Page
        * 
    * **Messenger Profile Api**
        * 10 API calls per 10 mins 
        * set, update, delete settings related to 
            * payments
            * whitelisted domains ( whitelist websites )
                * https and full domain
            * persistent menu
            * welcome screen ( first time )
            * Discover tab
            * Account linking ???
    * **Webview**:
        *   Load webpages inside message for interaction more
        *   Domain and sub-domains need to be whitelisted
        *   Messenger Extensions JS SDK
    * **Web Plug-ins**:
        * **Send to Messenger**:
            * After click on this button, a confirmation popup will be presented
            * Include Facebook Javascript SDK
            * Whitelisted Domain
        * **Checkbox Plugin**:
        * **Message US Plugin**:
            * Include Facebook Javascript SDK
            * This doesn't trigger a callback to your webhook. You will receieve a message callback.
