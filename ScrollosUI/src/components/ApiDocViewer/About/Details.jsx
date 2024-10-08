// import Rating from "../Rating";
import DiscussionsCount from "../DiscussionsCount";
import likeIcon from "../../../assets/cards-v2-icons/bookmark.svg";
import viewsIcon from "../../../assets/ApiDocViewer-Icons/views.svg";
import Contact from "../Contact";
import Like from "../../Common-components/Like";
import Rating from "../Rating";
import notLikedIcon from "../../../assets/ApiDocViewer-Icons/like-icons/not-liked.svg";
import likedOutlined from "../../../assets/ApiDocViewer-Icons/like-icons/likedOutlined.svg";

export default function Details(props) {
  const { clientUserData, apiDoc } = props;
  const createdDate = new Date(apiDoc.history.createdAt);
  return (
    <div className="details-container">
      <div className="title-container">
        <h2>{apiDoc.info.title}</h2>
        <Like clientUserData={clientUserData} apiDoc={apiDoc} />
      </div>
      {/* <Rating apiDoc={apiDoc} clientUserData={clientUserData} /> */}
      <div className="rating-date-container">
        <Rating apiDoc={apiDoc} clientUserData={clientUserData} />
        <div className="date-container"> 
          <div className="created-on">Created on </div>
          <div>{`${
            createdDate.getMonth() + 1
          }/${createdDate.getDate()}/${createdDate.getFullYear()}`}</div>
        </div>
      </div>
      <div className="border"></div>
      <div class="top-left-item-grid-container">
        <div className="item">
          <h3>Version</h3>
          <div>v{apiDoc.info.version}</div>
        </div>

        <div className="item">
          <h3>OpenAPI</h3>
          <div>
            {apiDoc.openapi ? (
              `v${apiDoc.openapi}`
            ) : (
              <div className="no-data">None</div>
            )}
          </div>
        </div>

        <div className="item">
          <h3>License</h3>
          <div>
            {apiDoc?.info?.license?.name ? (
              apiDoc?.info?.license?.name
            ) : (
              <div className="no-data">None</div>
            )}
          </div>
        </div>
        <div className="item">
          <h3>Views</h3>
          <div className="description-item-container">
            <img className="description-item-icon views-icon" src={viewsIcon} />
            <div>{apiDoc.views ? apiDoc.views : "0"}</div>
          </div>
        </div>
        <div className="item discussions--item">
          <h3>Discussions</h3>
          <DiscussionsCount apiDoc={apiDoc} />
        </div>
        <div className="item">
          <h3>Saves</h3>

          <div className="description-item-container">
            <img className="description-item-icon" src={notLikedIcon} />
            <div>
              {apiDoc?.ratings ? Object.keys(apiDoc.ratings).length : 0}
            </div>
          </div>
        </div>
      </div>

      <div className="border"></div>

      <div className="description-container">
        <h3>Description</h3>
        <div>
          {apiDoc.info.description ? (
            apiDoc.info.description
          ) : (
            <div className="no-data">None</div>
          )}
        </div>
      </div>

      {/* <div className="border"></div>

      <div className="contact-container">
        <h3>Contact</h3>
        <Contact apiDoc={apiDoc} />
      </div> */}
    </div>
  );
}
