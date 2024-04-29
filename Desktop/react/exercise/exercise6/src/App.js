import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [buttonName, setButtonName] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(NewFriend) {
    setFriends((friends) => [...friends, NewFriend]);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <button
          className="button"
          onClick={() => {
            setShowAddFriend((showAddFriend) => !showAddFriend);
            setButtonName((buttonName) => !buttonName);
          }}
        >
          {buttonName ? "Add friend" : "close"}
        </button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 ? (
        <p className="green">
          {friend.name} own you {Math.abs(friend.balance)}$.
        </p>
      ) : friend.balance === 0 ? (
        <p>You and {friend.name} are even.</p>
      ) : (
        <p className="red">
          You own {friend.name} {Math.abs(friend.balance)}$.
        </p>
      )}

      <button className="button" onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    if (!name || !image) return;
    e.preventDefault();

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>👩Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName((name) => e.target.value)}
        />
        <label>🧲Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage((image) => e.target.value)}
        />
        <button className="button">Add</button>
      </form>
    </div>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>🎀Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill((bill) => parseInt(e.target.value))}
      />
      <label>🎗Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser((paidByUser) => parseInt(e.target.value))
        }
      />
      <label>🦺{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={bill - paidByUser} />
      <label>🎨who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying((whoIsPaying) => e.target.value)}
      >
        <option>You</option>
        <option>{selectedFriend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}
