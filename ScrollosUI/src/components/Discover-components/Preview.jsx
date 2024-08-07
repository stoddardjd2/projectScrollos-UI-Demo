// preview container and info:
export default function Preview(props) {
    const {selectedApiDoc} = props
  return (
    <>
      {selectedApiDoc && (
        <div className="preview">
          <div>NOTES</div>
          <div>{selectedApiDoc.info?.version}</div>
          <div>{selectedApiDoc.info.liscense?.name}</div>
          <div>{selectedApiDoc.info.liscense?.url}</div>
          <div>{selectedApiDoc?.openapi}</div>
          {selectedApiDoc?.servers &&
            selectedApiDoc.servers.map((server, index) => {
              return (
                <div key={index}>
                  <div>{server?.url}</div>
                  <div>{server?.name}</div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}
