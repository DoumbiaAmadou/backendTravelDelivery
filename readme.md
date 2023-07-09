### Backend API to handle login, session, reservations, annoncements.
---
##### Table NoSQL

| User                |       Reservations       |                   Trips |
| ------------------- | :----------------------: | ----------------------: |
| email : String      |       \_id:String        |           name : String |
| name : String       |       name:String        |           user : String |
| firstnale : String  |   kilosReserved:Number   |    description : String |
| city : String       | kiloReservedPrice:Number |       cityFrom : String |
| adress : String     |        user: User        |         cityTo : String |
| cellphone : String  |    priceTotal:Number     |  departureDAte : String |
| userStatus : String |      date_Res:Date       |    arrivaldate : String |
|                     |                          |      kiloPrice : String |
|                     |                          | avalaiblekilos : String |
|                     |                          |      reservations : [ ] |
|                     |                          |          images: String |

API hosting on Heroku backentraveldelivery
