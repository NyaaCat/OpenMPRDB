OpenMPRDB is an open source implementation of the "Player Reputation Database" for public Minecraft servers.

# API v1

### Register

PUT `/v1/server/register`

`application/json`

| Field | Type | Value |
| --- | --- | --- |
| `message` | string | PGP-signed message |
| `public_key` | string | PGP public key |

PGP signed message content

| Field | Type | Value |
| --- | --- | --- |
| `server_name` | string | `Some server` |
  
Example

```
{
  "message":"----- BEGIN PGP SIGNED MESSAGE -----\n {"server_name":"Some server"}...",
  "public_key":"----- BEGIN PGP PUBLIC KEY -----..."
}
```

Response

- HTTP 201 `{"status":"OK","uuid":"a5fac3b4-ff62-4..."}`
- HTTP 400 `{"status":"NG","reason":"400 Bad Request"}`

### New Submit

PUT `/v1/submit/new`

`text/plain`

PGP signed message content

| Field | Type | Value | Comment |
| --- | --- | --- | --- |
| `uuid` | string | `a5fac3b4-ff62-4...` | Locally generated |
| `timestamp` | number | `1627802588` | |
| `player_uuid` | string | `09811bde-9399-4...` | |
| `points` | number | `-1` | Value from `-1` to `1` |
| `comment` | string | `Banned for cheating` | Max length: 255 bytes |

Example

```
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA1

{"uuid":"a5fac3b4-ff62-4...","timestamp":1627802588,"player_uuid":"09811bde-9399-4...","points":-1,"comment":"Banned for..."}

-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.13 (GNU/Linux)

(signature block)
-----END PGP SIGNATURE-----
```

Response

- HTTP 201 `{"status":"OK","uuid":"67ae556c-7123-4..."}` // Record UUID
- HTTP 400 `{"status":"NG","reason":"400 Bad Request"}`
- HTTP 401 `{"status":"NG","reason":"401 Unauthorized"}`
  
### Delete Submit

DELETE `/v1/submit/uuid/<submit_uuid>`

`text/plain`

PGP signed message content

| Field | Type | Value | Comment |
| --- | --- | --- | --- |
| `timestamp` | number | `1627802588` | |
| `comment` | string | `Revert incorrect record` | Max length: 255 bytes |

Example

```
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA1

{"timestamp":1627802588,"comment":"Revert..."}

-----BEGIN PGP SIGNATURE-----
Version: GnuPG v1.4.13 (GNU/Linux)

(signature block)
-----END PGP SIGNATURE-----
```

Response

- HTTP 200 `{"status":"OK","uuid":"67ae556c-7123-4..."}`
- HTTP 401 `{"status":"NG","reason":"401 Unauthorized"}`

### Get all servers

GET `/v1/submit/servers`

Response

- HTTP 200 `{"status":"OK","servers":"[{"uuid":"45dd64ba-a2a9-4...","fingerprint":"0xDCC453C2140AC9F63..."},{...]"}`
- HTTP 502 `{"status":"NG","reason":"502 Internal Server Error"}`
- HTTP 400 `{"status":"NG","reason":"400 Bad Request"}`

### Get submit details

GET `/v1/submit/uuid/<submit_uuid>`

Response

- HTTP 200 `{"status":"OK","content":"-----BEGIN PGP SIGNED MESSAGE-----..."}`
- HTTP 404 `{"status":"NG","reason":"404 Not Found"}`
- HTTP 400 `{"status":"NG","reason":"400 Bad Request"}`

### Get submits by server UUID or server key ID

GET `/v1/submit/server/<server_uuid>`

GET `/v1/submit/key/<server_key_id>`

Response

- HTTP 200 `{"status":"OK","submits":"[{"timestamp":1627372444,"uuid":"570345ac-fc71-4...","content":"-----BEGIN PGP SIGNED MESSAGE-----..."},{...]"}`
- HTTP 404 `{"status":"NG","reason":"404 Not Found"}`

# Clients

- CLI
- Spigot
- Paper
- BungeeCord
- Velocity

# FAQ

### Why

Bad manner has been a trouble since the early years of public Minecraft server communities. This project will record such behaviour and share the information across server communities, to stop those suckers before they can join and destroy another server.

OpenMPRDB is neutral by design. It utilizes [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) signature to ensure message integrity, and act as a relay hub to distribute the unchanged records.

Due to the fact that message stored on OpenMPRDB server cannot be modified, anyone on the Internet can operate an instance of OpenMPRDB. Server admin may choose whose public key to trust, and only the trusted message will be digested and applied locally.

BTW, "Reputation" is a neutral word. OpenMPRDB can also accept positive reputation as well.

### How

A typical workflow:

1. Client A (a server plugin, for example) initialize and generates a pair of PGP key. It sends its public key with a signed message to Server X (an OpenMPRDB instance) to verify and register itself. Server X will return a registered UUID to Client A.
2. Client A encountered bad guys, banned them then reported the player UUIDs, also with other complementary information in signed messages to Server X. Server X idenfied these messages are from Client A with a good signature, and so saved to database.
3. Other servers who trusted Client A's public key, gets the information from Server X, and verified the messages' integrity, hence banned these bad guys as well.

Result: other servers are protected from these bad guys.
