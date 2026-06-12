import { useEffect } from "react";
import "../css/Content.css";

function Content() {

    return (
        <section className="technoinc-def">
            <div className="what-is">
                <h1 className="scroll-effect">What is TechnoInc?</h1>
                <p className="scroll-effect">
                    It's a someone's historical map who has been playing it for over five years since 2021. 
                    Every block has a reason, every building has a story, and every journey has a memory. 
                    It's not popular but it's historical where times had flies.
                </p>
            </div>

            <div className="category-box">
                <div className="box-list">
                    <span>
                        <i className="fa-solid fa-heart-crack"></i>
                    </span>
                    <div className="activity-box">
                        <h3 className="scroll-effect">⚔️ War & Love</h3>
                        <p className="scroll-effect">
                            Participate in intense, wild raids and strategic conflicts. Victory isn't just 
                            about strength—it's about coordination, leadership and love.
                        </p>
                    </div>
                </div>

                <div className="box-list">
                    <span>
                        <i className="fa-solid fa-crown"></i>
                    </span>
                    <div className="activity-box">
                        <h3 className="scroll-effect">🎭 Roleplay & Naration</h3>
                        <p className="scroll-effect">
                            Become a king, president, minister, or peasant. Your story is yours to tell, 
                            and the naration brings it to life.
                        </p>
                    </div>
                </div>

                <div className="box-list">
                    <span>
                        <i className="fa-solid fa-users"></i>
                    </span>
                    <div className="activity-box">
                        <h3 className="scroll-effect">🛠️ Civilizations & Organizations</h3>
                        <p className="scroll-effect">
                            Develop your civilizations through deep exploration and unlock unique moments, 
                            contraptions, and arts that set you apart.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Content;