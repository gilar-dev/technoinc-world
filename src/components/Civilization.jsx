function Civilization({ flag, name, description }) {

    return(
        <div className="civil-box">
            <img 
                className="civil-img" 
                src={flag}>
            </img>
            <h3 className="civil-title">{name}</h3>
            <p className="civil-text">{description}</p>
        </div>
    );
}

export default Civilization;