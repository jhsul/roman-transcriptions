const Card = ({ transcription, findingPlace, findingSpot, url, country }) => {
  return (
    <div className="card">
      <img src={url} style={{ borderBottom: "1px solid #eaeaea" }} />
      <i>{transcription}</i>
      <p>
        {findingPlace}, {country} at {findingSpot}
      </p>
    </div>
  );
};

export default Card;
