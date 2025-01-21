export default function GroupSearch({
  styles,
  searchForRoom,
  createGroupChat,
  setcreateRoomInput,
  setJoinRoomInput,
}) {
  return (
    <div className={styles.groupSearch}>
      <form action="">
        <div>
          <input
            type="text"
            name="roomSearch"
            onChange={(e) => setJoinRoomInput(e.target.value)}
          />
          <button type="submit" onClick={searchForRoom}>
            Join Room
          </button>
        </div>
        <div>
          <input
            type="text"
            name="roomCreate"
            onChange={(e) => setcreateRoomInput(e.target.value)}
            placeholder="16 character limit"
          />
          <button type="submit" onClick={createGroupChat}>
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
}
