const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
// const routes = require("./routes/events.routes.js");
// const routesAdmin = admin.initializeApp({
//   credential: admin.credential.cert("../routes/events.routes.js"),
// });
const router = require("express")();
admin.initializeApp();

const db = admin.firestore()
    .collection("events");


app.use("/api/v1", router);


// View a contact
router.get("/events/:id", (request, response) => {
  db.doc(request.params.id).get()
      .then((event) => response.status(200).json({
        id: event.id,
        userID: event.data().userID,
        eventName: event.data().eventName,
        locationID: event.data().locationID,
        startDate: event.data().startDate,
        endDate: event.data().endDate,
        createDate: event.data().createDate,
      })
          .catch((error) => response.status(400)
              .send(`Cannot get event: ${error}`)));
});

router.get("/events", (request, response) => {
  db.get()
      .then((events) => {
        const listEvents = [];

        events.forEach((event) => {
          listEvents.push({
            id: event.id,
            userID: event.data().userID,
            eventName: event.data().eventName,
            locationID: event.data().locationID,
            startDate: new Date(event.data().startDate),
            endDate: new Date(event.data().endDate),
            createDate: new Date(event.data().createDate),
          });
        });

        response.json(listEvents);
      });
});


router.post("/events", (request, response) => {
  const startDate = new Date(Date.parse(request.body.startDate));
  const endDate = new Date(Date.parse(request.body.endDate));
  const actualDate = new Date(Date.now());

  const newEvent = {
    "userID": request.body.userID,
    "eventName": request.body.eventName,
    "locationID": request.body.locationID,
    "startDate": startDate,
    "endDate": endDate,
    "createDate": actualDate,
  };
  db.add(newEvent)
      .then(() => {
        response.status(200).json("Success Added");
      });
});

router.delete("/events/:id", (request, response) => {
  db.doc(request.params.id).delete()
      .then((item) => {
        response.status(204).send(`Event is deleted: ${item}`);
      })
      .catch((item) => {
        response.status(404).send("Event deleted fail.");
      });
});

// Update new contact
router.patch("/events/:id", (request, response) => {
  // const startDate = new Date(Date.parse(request.body.startDate));
  // const endDate = new Date(Date.parse(request.body.endDate));
  try {
    const newEvent = {};
    const body = request.body;
    if (body.userID) newEvent.userID = body.userID;

    if (body.eventName) newEvent.eventName = body.eventName;
    if (body.locationID) newEvent.locationID = body.locationID;
    if (body.startDate) {
      const startDate = new Date(Date.parse(body.startDate));
      newEvent.startDate =startDate;
    }
    if (body.endDate) {
      const endDate = new Date(Date.parse(body.endDate));
      newEvent.endDate = endDate;
    }
    db.doc(request.params.id).update(newEvent)
        .then(
            (event)=>response.send(`${event.id} updated sucessfully`)
        );
    //     .then((event)=>
    //       response.send(event.data()));
    // doc.update(newEvent)
    //     .then((item) => {
    //       response.status(204).send(`Event is updated: ${item}`);
    //     })
    //     .catch((item) => {
    //       response.status(404).send("Event updated fail.");
    //     });
  } catch (ex) {
    response.status(500).send("ERRO: " + ex.message);
  }
});

exports.dbEvents = functions.https.onRequest(app);
