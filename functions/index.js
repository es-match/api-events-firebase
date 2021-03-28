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


router.get("/events/byGroup/:groupID", (request, response) => {
  db.where("groupID", "==", request.params.groupID).get()
      .then((events) => {
        if (!events.empty) {
          const listEvents = [];
          events.forEach((ev) => {
            const evData = ev.data();

            listEvents.push({
              id: ev.id,
              groupID: evData.groupID == null ?
              "" : evData.groupID,
              eventName: evData.eventName == null ?
              "" : evData.eventName,
              locationID: evData.locationID == null ?
              "": evData.locationID,
              startDate: evData.startDate == null ?
              [""] : evData.startDate.toDate(),
              // .toLocaleDateString("pt-BR"),
              endDate: evData.endDate == null ?
              [""] : evData.endDate.toDate(),
              // .toLocaleDateString("pt-BR"),
              createDate: evData.createDate == null ?
              [""] : evData.createDate.toDate(),
              // .toLocaleDateString("pt-BR"),
              userID: evData.userID == null ?
               "": evData.userID,
            });
          });
          response.json(listEvents);
        } else {
          response.send("Events by Group not found");
        }
      });

  // response.send("Events by Group not found");
});


// View a contact
router.get("/events/:id", (request, response) => {
  db.doc(request.params.id).get()
      .then((ev) => response.status(200).json({
        id: ev.id,
        groupID: ev.data().groupID == null ?
        "" : ev.data().groupID,
        eventName: ev.data().eventName == null ?
        "" : ev.data().eventName,
        locationID: ev.data().locationID == null ?
        "": ev.data().locationID,
        startDate: ev.data().startDate == null ?
        [""] : ev.data().startDate,
        endDate: ev.data().endDate == null ?
         [""] : ev.data().endDate,
        createDate: ev.data().createDate == null ?
         [""] : ev.data().createDate,
        userID: ev.data().userID == null ?
         "": ev.data().userID,
      })
          .catch((error) => response.status(400)
              .send(`Cannot get event: ${error}`)));
});

router.get("/events", (request, response) => {
  db.get()
      .then((events) => {
        const listEvents = [];

        events.forEach((ev) => {
          listEvents.push({
            id: ev.id,
            groupID: ev.data().groupID == null ?
            "" : ev.data().groupID,
            eventName: ev.data().eventName == null ?
            "" : ev.data().eventName,
            locationID: ev.data().locationID == null ?
            "": ev.data().locationID,
            startDate: ev.data().startDate == null ?
            [""] : ev.data().startDate,
            endDate: ev.data().endDate == null ?
             [""] : ev.data().endDate,
            createDate: ev.data().createDate == null ?
             [""] : ev.data().createDate,
            userID: ev.data().userID == null ?
             "": ev.data().userID,
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
