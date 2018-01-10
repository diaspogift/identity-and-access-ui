const  HOST = "localhost";
const  PROTOCOLE = "http://";
const  PORT = "8081";
const  AUTH_PATH = "/oauth/token";
const  API_PATH = "/api/v1/";
const  CLIENT_ID = "sysadmin";
const  SECRET = "ManagingMembers@@2017";
export const ACCESSTOKEN_LINK = PROTOCOLE+HOST+":" + PORT+AUTH_PATH;
//"http://localhost/v1/oauth/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&grant_type=authorization_code&code=AUTHORIZATION_CODE&redirect_uri=CALLBACK_URL";

export const ACCESSTOKEN = "4ca00fc8-d52c-4135-850d-28dc5e53f1dd";

export const DGTENANTID = "FB06037B-B1B5-4C71-8C69-E630036B9DFF";

export const BASE_API_URL = PROTOCOLE + HOST + ":" + PORT + "/api/v1/tenants/";



/*

curl -X POST -vu dg-collaboration-angular4-client:123456 -H "Accept: application/json" -d "password=/2E7b}z1&username=95BC5749-851D-44E5-95C3-0411B72F8B45_admin&grant_type=password&scope=trusted" http://localhost:8081/oauth/token

curl -X GET -H "Accept: application/json" -H "Authorization: Bearer fcd70a34-231e-438b-b853-86a7052b4a68"  http://localhost:8081/api/v1/tenants



{"tenants":[{"tenantId":"2DA3632F-245F-4FAC-8E14-4C18C980871B","name":"CADEAUX","description":"Super Marche Cadeaux","active":true,"_links":{"self":{"href":"http://localhost:8081/api/v1/tenants/2DA3632F-245F-4FAC-8E14-4C18C980871B"},"groups":{"href":"http://localhost:8081/api/v1/tenants/2DA3632F-245F-4FAC-8E14-4C18C980871B/groups"},"users":{"href":"http://localhost:8081/api/v1/tenants/2DA3632F-245F-4FAC-8E14-4C18C980871B/users"}}},{"tenantId":"EAF0E5CE-05E4-412D-BA15-DC0B57A47EC1","name":"BINGO","description":"HOPITAL BINGO","active":true,"_links":{"self":{"href":"http://localhost:8081/api/v1/tenants/EAF0E5CE-05E4-412D-BA15-DC0B57A47EC1"},"groups":{"href":"http://localhost:8081/api/v1/tenants/EAF0E5CE-05E4-412D-BA15-DC0B57A47EC1/groups"},"users":{"href":"http://localhost:8081/api/v1/tenants/EAF0E5CE-05E4-412D-BA15-DC0B57A47EC1/users"}}}]}


{"tenantId":"FB06037B-B1B5-4C71-8C69-E630036B9DFF","username":"admin","emailAddress":"cadeaux@gmail.com"}

{"access_token":"d1511035-518e-4e47-b433-84ea99cda495","token_type":"bearer","refresh_token":"0e6da6c1-4ce0-443e-a664-05ec652277d1","expires_in":43199,"scope":"trusted"}

curl -X GET -H "Accept: application/json" -H "Authorization: Bearer d1511035-518e-4e47-b433-84ea99cda495"  http://localhost:8081/api/v1/tenants/FB06037B-B1B5-4C71-8C69-E630036B9DFF/users/admin/autenticated-with/nj%28rM%3EYp1

 */


