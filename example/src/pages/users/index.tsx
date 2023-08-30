interface Props {}

const UserList = ({
  Actions,
  Table
}: {
  Actions: React.FC<Props>;
  Table: React.FC<Props>;
}) => {
  return (
    <div>
      <h1 style={{ backgroundColor: 'pink' }}>This is User list page</h1>

      {Actions ? <Actions /> : null}
      {Table ? <Table /> : null}
    </div>
  );
};

export default UserList;
