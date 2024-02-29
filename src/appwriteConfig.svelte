<script>
import { Client, Account, Databases } from "appwrite";


export const client = new Client();

client
     .setEndpoint('https://cloud.appwrite.io/v1')
     .setProject('65dcef70b264fce7d523');

export const account = new Account(client);
export const databases = new Databases(client);

export const PROJECT_ID = "65dcef70b264fce7d523"
export const DATABASE_ID = "65dcf15fcf3ad3efa311"
export const COLLECTION_MESSAGES = "65dcf1b8ae5a73103269"


</script>