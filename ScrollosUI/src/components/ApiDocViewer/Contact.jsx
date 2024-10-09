import urlIcon from "../../assets/contact/address.svg";
import emailIcon from "../../assets/contact/email.svg";
import nameIcon from "../../assets/contact/name.svg";

export default function Contact(props) {
    const {apiDoc} = props
  return (
    <div class="contact-grid-container">
      <div className="box">
        <h3>Name</h3>
        <div className="contact-icon-container">
          <img src={nameIcon} />
          {apiDoc.info?.contact?.name ? <div>{apiDoc.info.contact.name}</div> : <div className="no-data">None</div>}
        </div>
      </div>
      <div className="box">
        <h3>Email</h3>
        <div className="contact-icon-container">
          <img src={emailIcon} />
          <div>{apiDoc.info?.contact?.email ? apiDoc.info.contact.email : <div className="no-data">None</div>}</div>
        </div>
      </div>
      <div className="box">
        <h3>URL</h3>
        <div className="contact-icon-container">
          <img src={urlIcon} />{" "}
          <a href={apiDoc.info?.contact?.url}>{apiDoc.info?.contact?.url ? apiDoc.info.contact.url : <div className="no-data">None</div>}</a>
        </div>
      </div>
    </div>
  );
}
