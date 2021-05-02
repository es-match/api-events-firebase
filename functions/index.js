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
const dbGroup = admin.firestore()
    .collection("groups");
const dbAct = admin.firestore()
    .collection("activities");

app.use("/api/v1", router);


router.get("/events/byGroup/:groupID", async (request, response) => {
  const events = await db
      .where("groupID", "==", request.params.groupID).get();

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
          "_latitude":
            null,
          "_longitude":
            null,
        },
        imageUrl: null,
      };
      let _userName;
      let _groupName;
      let _activityID;
      let _activityName;

      try {
        _activityID = await dbGroup.doc(eventData.groupID).get()
            .then((group) =>{
              _groupName = group.data().groupName == null ?
              "" : group.data().groupName;
              return group.data().activityID == null ?
              "" : group.data().activityID;
            });

        _activityName = await dbAct.doc(_activityID).get()
            .then((activity) => {
              return activity.data().activityName == null ?
              "" : activity.data().activityName;
            });
      } catch (error) {
        _groupName = "";
      }


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
                "_latitude": location.data().geolocation.latitude != null ?
                  location.data().geolocation.latitude : null,
                "_longitude": location.data().geolocation.longitude != null ?
                  location.data().geolocation.longitude : null,

              },
                imageUrl: location.data().imageUrl != null ?
                location.data().imageUrl : null,
              };
            });
      } catch (error) {
        _location = {
          locationName: null,
          address: null,
          geolocation:
          {
            "_latitude":
              null,
            "_longitude":
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
        locationName: _location.locationName,
        address: _location.address,
        geolocation:
        {
          "_latitude": _location.geolocation._latitude,
          "_longitude": _location.geolocation._longitude,
        },
        imageUrl: _location.imageUrl,
        groupName: _groupName,
        activityName: _activityName,
      });
      // }
    }
    response.json(listEvents);
  } else {
    response.send("Events by Group not found");
  }

  // response.send("Events by Group not found");
});


router.get("/events/byUserFollow/:userID", async (request, response) => {
  const groups = await
  dbGroup
      .where("groupUsers", "array-contains", request.params.userID).get();
  // .then((ev)=>{
  //   const list = [];
  //   ev.forEach((event)=>{
  //     list.push(event.id);
  //   });
  //   return list;
  // });
  if (groups.empty) {
    response.send("User does not have events");
  }
  const listGroups = [];
  groups.forEach((gr) => {
    listGroups.push(gr.id);
  });


  const events = await db
      .where("groupID", "in", listGroups).get();

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
          "_latitude":
            null,
          "_longitude":
            null,
        },
        imageUrl: null,
      };
      let _userName;
      let _groupName;
      let _activityID;
      let _activityName;

      try {
        _activityID = await dbGroup.doc(eventData.groupID).get()
            .then((group) =>{
              _groupName = group.data().groupName == null ?
              "" : group.data().groupName;
              return group.data().activityID == null ?
              "" : group.data().activityID;
            });

        _activityName = await dbAct.doc(_activityID).get()
            .then((activity) => {
              return activity.data().activityName == null ?
              "" : activity.data().activityName;
            });
      } catch (error) {
        _groupName = "";
      }


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
                "_latitude": location.data().geolocation.latitude != null ?
                  location.data().geolocation.latitude : null,
                "_longitude": location.data().geolocation.longitude != null ?
                  location.data().geolocation.longitude : null,

              },
                imageUrl: location.data().imageUrl != null ?
                location.data().imageUrl : null,
              };
            });
      } catch (error) {
        _location = {
          locationName: null,
          address: null,
          geolocation:
          {
            "_latitude":
              null,
            "_longitude":
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
        locationName: _location.locationName,
        address: _location.address,
        geolocation:
        {
          "_latitude": _location.geolocation._latitude,
          "_longitude": _location.geolocation._longitude,
        },
        imageUrl: _location.imageUrl,
        groupName: _groupName,
        activityName: _activityName,
      });
      // }
    }
    response.json(listEvents);
  } else {
    response.send("Events by Group not found");
  }

  // response.send("Events by Group not found");
});


router.get("/events/byLocation/:locationID", async (request, response) => {
  const events = await db
      .where("locationID", "==", request.params.locationID).get();

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
          "_latitude":
            null,
          "_longitude":
            null,
        },
        imageUrl: null,
      };
      let _userName;
      let _groupName;
      let _activityID;
      let _activityName;

      try {
        _activityID = await dbGroup.doc(eventData.groupID).get()
            .then((group) =>{
              _groupName = group.data().groupName == null ?
              "" : group.data().groupName;
              return group.data().activityID == null ?
              "" : group.data().activityID;
            });

        _activityName = await dbAct.doc(_activityID).get()
            .then((activity) => {
              return activity.data().activityName == null ?
              "" : activity.data().activityName;
            });
      } catch (error) {
        _groupName = "";
      }


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
                "_latitude": location.data().geolocation.latitude != null ?
                  location.data().geolocation.latitude : null,
                "_longitude": location.data().geolocation.longitude != null ?
                  location.data().geolocation.longitude : null,

              },
                imageUrl: location.data().imageUrl != null ?
                location.data().imageUrl : null,
              };
            });
      } catch (error) {
        _location = {
          locationName: null,
          address: null,
          geolocation:
          {
            "_latitude":
              null,
            "_longitude":
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
        locationName: _location.locationName,
        address: _location.address,
        geolocation:
        {
          "_latitude": _location.geolocation._latitude,
          "_longitude": _location.geolocation._longitude,
        },
        imageUrl: _location.imageUrl,
        groupName: _groupName,
        activityName: _activityName,
      });
      // }
    }
    response.json(listEvents);
  } else {
    response.send("Event by Location not found");
  }

  // response.send("Events by Group not found");
});


// View a contact
router.get("/events/:id", async (request, response) => {
  const event = await db.doc(request.params.id).get();

  if (event != null) {
    const eventData = {
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
      endDate: event.data().endDate == null ?
        [""] : event.data().endDate.toDate(),
      createDate: event.data().createDate == null ?
        [""] : event.data().createDate.toDate(),
      userID: event.data().userID == null ?
        "" : event.data().userID,
    };


    let _location = {
      locationName: null,
      address: null,
      geolocation:
      {
        "_latitude":
          null,
        "_longitude":
          null,
      },
      imageUrl: null,
    };
    let _userName;
    let _groupName;
    let _activityID;
    let _activityName;

    try {
      _activityID = await dbGroup.doc(eventData.groupID).get()
          .then((group) =>{
            _groupName = group.data().groupName == null ?
            "" : group.data().groupName;
            return group.data().activityID == null ?
            "" : group.data().activityID;
          });

      _activityName = await dbAct.doc(_activityID).get()
          .then((activity) => {
            return activity.data().activityName == null ?
            "" : activity.data().activityName;
          });
    } catch (error) {
      _groupName = "";
    }


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
              "_latitude": location.data().geolocation.latitude != null ?
                location.data().geolocation.latitude : null,
              "_longitude": location.data().geolocation.longitude != null ?
                location.data().geolocation.longitude : null,

            },
              imageUrl: location.data().imageUrl != null ?
              location.data().imageUrl : null,
            };
          });
    } catch (error) {
      _location = {
        locationName: null,
        address: null,
        geolocation:
        {
          "_latitude":
            null,
          "_longitude":
            null,
        },
        imageUrl: null,
      };
    }
    const finalEvent = {
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
      locationName: _location.locationName,
      address: _location.address,
      geolocation:
      {
        "_latitude": _location.geolocation._latitude,
        "_longitude": _location.geolocation._longitude,
      },
      imageUrl: _location.imageUrl,
      groupName: _groupName,
      activityName: _activityName,
    };

    response.json(finalEvent);
  } else {
    response.send("Event not found");
  }
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
          "_latitude":
            null,
          "_longitude":
            null,
        },
        imageUrl: null,
      };
      let _userName;
      let _groupName;
      let _activityID;
      let _activityName;

      try {
        _activityID = await dbGroup.doc(eventData.groupID).get()
            .then((group) =>{
              _groupName = group.data().groupName == null ?
              "" : group.data().groupName;
              return group.data().activityID == null ?
              "" : group.data().activityID;
            });

        _activityName = await dbAct.doc(_activityID).get()
            .then((activity) => {
              return activity.data().activityName == null ?
              "" : activity.data().activityName;
            });
      } catch (error) {
        _groupName = "";
      }


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
                "_latitude": location.data().geolocation.latitude != null ?
                  location.data().geolocation.latitude : null,
                "_longitude": location.data().geolocation.longitude != null ?
                  location.data().geolocation.longitude : null,

              },
                imageUrl: location.data().imageUrl != null ?
                location.data().imageUrl : null,
              };
            });
      } catch (error) {
        _location = {
          locationName: null,
          address: null,
          geolocation:
          {
            "_latitude":
              null,
            "_longitude":
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
        locationName: _location.locationName,
        address: _location.address,
        geolocation:
        {
          "_latitude": _location.geolocation._latitude,
          "_longitude": _location.geolocation._longitude,
        },
        imageUrl: _location.imageUrl,
        groupName: _groupName,
        activityName: _activityName,
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
  let _location = {
    locationName: null,
    address: null,
    geolocation:
    {
      "_latitude":
        null,
      "_longitude":
        null,
    },
    imageUrl: null,
  };
  let _groupName;
  let _activityID;
  let _activityName;


  const newEvent = {
    "userID": request.body.userID,
    "eventName": request.body.eventName,
    "locationID": request.body.locationID,
    "groupID":request.body.groupID,
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

  try {
    _activityID = await dbGroup.doc(request.body.groupID).get()
        .then((group) =>{
          _groupName = group.data().groupName == null ?
          "" : group.data().groupName;
          return group.data().activityID == null ?
          "" : group.data().activityID;
        });

    _activityName = await dbAct.doc(_activityID).get()
        .then((activity) => {
          return activity.data().activityName == null ?
          "" : activity.data().activityName;
        });
  } catch (error) {
    _groupName = "";
  }

  try {
    _location = await dbLoc.doc(request.body.locationID).get()
        .then((location) => {
          return {
            locationName: location.data().locationName != null ?
            location.data().locationName : null,
            address: location.data().address != null ?
            location.data().address : null,
            geolocation:
          {
            "_latitude": location.data().geolocation.latitude != null ?
              location.data().geolocation.latitude : null,
            "_longitude": location.data().geolocation.longitude != null ?
              location.data().geolocation.longitude : null,

          },
            imageUrl: location.data().imageUrl != null ?
            location.data().imageUrl : null,
          };
        });
  } catch (error) {
    _location = {
      locationName: null,
      address: null,
      geolocation:
      {
        "_latitude":
          null,
        "_longitude":
          null,
      },
      imageUrl: null,
    };
  }


  db.add(newEvent)
      .then((event) => {
        newEvent.id = event.id;
        newEvent.userName = _userName;
        newEvent.locationName = _location.locationName;
        newEvent.address = _location.address;
        newEvent.geolocation =
        {
          "_latitude": _location.geolocation._latitude,
          "_longitude": _location.geolocation._longitude,
        };
        newEvent.imageUrl = _location.imageUrl;
        newEvent.groupName= _groupName;
        newEvent.activityName= _activityName;
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
