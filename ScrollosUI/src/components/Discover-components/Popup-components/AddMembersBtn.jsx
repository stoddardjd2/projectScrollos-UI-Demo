import { useState } from "react";
import searchIcon from "../../../assets/search.svg";
import uncheckedIcon from "../../../assets/emptyCheckbox.svg";
import checkedIcon from "../../../assets/checked.svg";
export default function AddMembersBtn(props) {
  const { loadedProjects, selectedProject } = props;
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [membersMatchingSearch, setMembersMatchingSearch] = useState([]);
  function handleAddMembers() {
    setIsAddingMembers(!isAddingMembers);
  }

  function handleSearchMembers(e) {
    e.preventDefault();
    const inputValue = e.target.value;

    console.log("serach", inputValue);
    if (inputValue == "") {
      setMembersMatchingSearch([]);
    } else {
      fetch(`http://localhost:3001/searchForUser/${inputValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          setMembersMatchingSearch(json);
          console.log("resp for user search", json);
        });
    }
  }
  return (
    <div className="members-btn-container">
      <button onClick={handleAddMembers} className="add-members-btn">
        <div className="btn-inner-container">
          <div className="plus">+</div>

          <div>Invite Members</div>
        </div>
      </button>
      {isAddingMembers && (
        <div className="add-members-popup">
          <form onSubmit={handleSearchMembers} className="add-members-form">
            <div className="triangle"></div>

            <input
              onChange={handleSearchMembers}
              placeholder="add by username"
            ></input>
            <img src={searchIcon} />
          </form>
          <div className="members-list">
            {membersMatchingSearch.map((member, index) => {
              if (index <= 5) {
                //limit amount of members to display on search (current is 6)
                let checked = false;
                if (
                  loadedProjects[selectedProject].members.joined.includes(
                    member._id
                  )
                ) {
                  checked = true;
                }
                return (
                  <div
                    index={index}
                    className={`members-item-container child-${index}`}
                  >
                    <div>
                      <div className="username-container">
                        <div>{member.username}</div>
                        <img src={checked ? checkedIcon : uncheckedIcon} />
                      </div>

                      <div className="id-item">ID: {member._id}</div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
