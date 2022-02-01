import { search } from "./search";
import Card from "./Card";
import { useState } from "react";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <>
      <div className="page">
        <form
          className="input-group"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setData([]);

            const input = document.getElementById("input").value;
            const results = await search(input);

            setLoading(false);
            setData(results ? results : []);
          }}
        >
          <input
            id="input"
            type="text"
            className="form-control"
            placeholder="Caesar"
          ></input>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        {loading && (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <div className="cards-container">
          {data.map((p) => (
            <Card {...p} />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
