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
const dbUser = admin.firestore()
    .collection("users");
const dbLoc = admin.firestore()
    .collection("locations");

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
              "" : evData.locationID,
              confirmedUsers: evData.confirmedUsers == null ?
              [""] : evData.confirmedUsers,
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
              "" : evData.userID,
            });
          });
          response.json(listEvents);
        } else {
          response.send("Events by Group not found");
        }
      });

  // response.send("Events by Group not found");
});

router.get("/events/byLocation/:locationID", (request, response) => {
  db.where("locationID", "==", request.params.locationID).get()
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
              "" : evData.locationID,
              confirmedUsers: evData.confirmedUsers == null ?
              [""] : evData.confirmedUsers,
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
              "" : evData.userID,
            });
          });
          response.json(listEvents);
        } else {
          response.send("Events by Location not found");
        }
      });

  // response.send("Events by Group not found");
});


// View a contact
router.get("/events/:id", (request, response) => {
  db.doc(request.params.id).get()
      .then((event) => response.status(200).json({
        id: event.id,
        groupID: event.data().groupID == null ?
        "" : event.data().groupID,
        eventName: event.data().eventName == null ?
        "" : event.data().eventName,
        locationID: event.data().locationID == null ?
        "" : event.data().locationID,
        confirmedUsers: event.data().confirmedUsers == null ?
        [""] : event.data().confirmedUsers,
        startDate: event.data().startDate == null ?
        [""] : event.data().startDate.toDate(),
        // .toLocaleDateString("pt-BR"),
        endDate: event.data().endDate == null ?
        [""] : event.data().endDate.toDate(),
        // .toLocaleDateString("pt-BR"),
        createDate: event.data().createDate == null ?
        [""] : event.data().createDate.toDate(),
        // .toLocaleDateString("pt-BR"),
        userID: event.data().userID == null ?
        "" : event.data().userID,
      })
          .catch((error) => response.status(400)
              .send(`Cannot get event: ${error}`)));
});

router.get("/events", async (request, response) => {
  const events = await db.get();

  if (!events.empty) {
    const listEvents = [];
    const tempEvents = [];
    events.forEach((ev) => {
      tempEvents.push({
        id: ev.id,
        groupID: ev.data().groupID == null ?
          "" : ev.data().groupID,
        eventName: ev.data().eventName == null ?
          "" : ev.data().eventName,
        locationID: ev.data().locationID == null ?
          "" : ev.data().locationID,
        confirmedUsers: ev.data().confirmedUsers == null ?
          [""] : ev.data().confirmedUsers,
        startDate: ev.data().startDate == null ?
          [""] : ev.data().startDate.toDate(),
        endDate: ev.data().endDate == null ?
          [""] : ev.data().endDate.toDate(),
        createDate: ev.data().createDate == null ?
          [""] : ev.data().createDate.toDate(),
        userID: ev.data().userID == null ?
          "" : ev.data().userID,
      });
    });

    for (const event of tempEvents) {
      // groups.forEach((group) => {
      // if (tempGroups[group] != null) {
      const eventData = event;

      let _location = {
        locationName: null,
        address: null,
        geolocation:
        {
          "latitude":
            null,
          "longitude":
            null,
        },
        imageUrl: null,
      };
      let _userName;

      try {
        _userName = await dbUser.doc(eventData.userID).get()
            .then((user) => {
              return user.data().userName == null ?
              "" : user.data().userName;
            });
      } catch (error) {
        _userName = "";
      }

      try {
        _location = await dbLoc.doc(eventData.locationID).get()
            .then((location) => {
              return {
                locationName: location.data().locationName != null ?
                location.data().locationName : null,
                address: location.data().address != null ?
                location.data().address : null,
                geolocation:
              {
                "latitude": location.data().geolocation.latitude != null ?
                  location.data().geolocation.latitude.toString() : null,
                "longitude": location.data().geolocation.longitude != null ?
                  location.data().geolocation.longitude.toString() : null,
                "imageUrl": location.data().imageUrl != null ?
                  location.data().imageUrl : null,
              },

              };
            });
      } catch (error) {
        _location = {
          locationName: null,
          address: null,
          geolocation:
          {
            "latitude":
              null,
            "longitude":
              null,
          },
          imageUrl: null,
        };
      }

      listEvents.push({
        id: event.id,
        groupID: eventData.groupID,
        eventName: eventData.eventName,
        locationID: eventData.locationID,
        confirmedUsers: eventData.confirmedUsers,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        createDate: eventData.createDate,
        userID: eventData.userID,
        userName: _userName,
        locationName: _location.locationName == null ?
          "" : _location.locationName,
        address: _location.address == null ?
          "" : _location.address,
        geolocation:
        {
          "latitude": _location.geolocation.latitude != null ?
            _location.geolocation.latitude.toString() : null,
          "longitude": _location.geolocation.longitude != null ?
            _location.geolocation.longitude.toString() : null,
        },
        imageUrl: _location.imageUrl == null ?
          "" : _location.imageUrl,
      });
      // }
    }
    response.json(listEvents);
  } else {
    response.send("Events not found");
  }
});


router.post("/events", async (request, response) => {
  const startDate = new Date(Date.parse(request.body.startDate));
  const endDate = new Date(Date.parse(request.body.endDate));
  const actualDate = new Date(Date.now());
  let _userName;

  const newEvent = {
    "userID": request.body.userID,
    "eventName": request.body.eventName,
    "locationID": request.body.locationID,
    "startDate": startDate,
    "endDate": endDate,
    "createDate": actualDate,
  };

  try {
    _userName = await dbUser.doc(request.body.userID).get()
        .then((user) => {
          return user.data().userName == null ?
          "" : user.data().userName;
        });
  } catch (error) {
    _userName = null;
  }

  db.add(newEvent)
      .then((event) => {
        newEvent.id = event.id;
        newEvent.userName = _userName;
        response.status(200).json(newEvent);
      }).catch((e) => {
        response.status(500);
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
      newEvent.startDate = startDate;
    }
    if (body.endDate) {
      const endDate = new Date(Date.parse(body.endDate));
      newEvent.endDate = endDate;
    }
    db.doc(request.params.id).update(newEvent)
        .then(
            (event) => response.send(`${event.id} updated sucessfully`),
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
