using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BlueYonder.Entities;
using BlueYonder.DataAccess.Interfaces;
using BlueYonder.Companion.WNS;
using BlueYonder.Companion.Entities;

namespace BlueYonder.Companion.Controllers
{
    public class TravelersController : ApiController
    {
        private ITravelerRepository Travelers { get; set; }

        public TravelersController(ITravelerRepository travelers)
        {
            Travelers = travelers;
        }

        public IEnumerable<Traveler> Get()
        {
            var travelers = Travelers.GetAll();

            return travelers.ToList();
        }

        public HttpResponseMessage Get(string id)
        {
            var traveler = Travelers.FindBy(t => t.TravelerUserIdentity == id).FirstOrDefault();

            // Handling the HTTP status codes
            if (traveler != null)
                return Request.CreateResponse<Traveler>(HttpStatusCode.OK, traveler);
            else
                return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        public HttpResponseMessage GetTravelerByUserIdentity([FromUri]string travelerUserIdentity)
        {
            var traveler = Travelers.FindBy(t=>t.TravelerUserIdentity == travelerUserIdentity).SingleOrDefault();

            // Handling the HTTP status codes
            if (traveler != null)
                return Request.CreateResponse<Traveler>(HttpStatusCode.OK, traveler);
            else
                return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        //[HttpPost]
        //public HttpResponseMessage RegisterForNotifications
        //    ([FromBody]RegisterNotificationsRequest request)
        //{
        //    var traveler = Travelers.FindBy(t => t.TravelerUserIdentity == request.DeviceID).SingleOrDefault();

        //    // Handling the HTTP status codes
        //    if (traveler == null)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotFound);
        //    }
        //    else
        //    {
        //        WNSManager.RegisterDevice(request.DeviceID, request.DeviceURI);
        //        return Request.CreateResponse(HttpStatusCode.Created, request);
        //    }
        //}

        public HttpResponseMessage Post([FromBody]Traveler traveler)
        {
            // saving the new order to the database
            Travelers.Add(traveler);
            Travelers.Save();

            // creating the response, with three key features:
            // 1. the newly saved entity
            // 2. 201 Created status code
            // 3. Location header with the location of the new resource
            var response = Request.CreateResponse(HttpStatusCode.Created, traveler);
            response.Headers.Location = new Uri(Request.RequestUri, traveler.TravelerId.ToString());
            return response;
        }

        public HttpResponseMessage Put(int id, [FromBody]Traveler traveler)
        {
            // returning 404 if the entity doesn't exist 
            if (Travelers.GetSingle(id) == null)
                return Request.CreateResponse(HttpStatusCode.NotFound);

            Travelers.Edit(traveler);
            Travelers.Save();
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public HttpResponseMessage Delete(int id)
        {
            var reservation = Travelers.GetSingle(id);

            // returning 404 if the entity doesn't exist 
            if (reservation == null)
                return Request.CreateResponse(HttpStatusCode.NotFound);

            Travelers.Delete(reservation);
            Travelers.Save();
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}