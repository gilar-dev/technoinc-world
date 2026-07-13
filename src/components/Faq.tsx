import { useState } from "react";
import "../css/Faq.css";

function Faq() {
    const [selectedValue, setSelectedValue] = useState<null | string>(null);

    const showAnswer = (value: string) => {
        setSelectedValue(selectedValue === value ? null : value);
    }

    return (
        <section className="faq-container">
            <div className="story-box scroll-effect">
                <h3 className="scroll-effect unchanged">The Story</h3>
                <p className="scroll-effect unchanged">
                    TechnoInc began in 2021, created by GilarInc which inspired by Technoblade as an ambitious world in player-driven worldbuilding. 
                    what started as a small, survival-only project quickly evolved into a full-scale civilization world centered around narations, politics, and storytelling. 
                    As the world grew, TechnoInc expanded into multiple civilizations—most notably ULA (United Lands of Augusta), PSSR (People's Sosnev Socialist Republics), 
                    Versaly, and Franzel—each introducing new mechanics, conflicts, and eras of history. Today TechnoInc stands as a living world—constantly evolving, shaped by the story, 
                    and defined by the history player create every day.
                </p>
            </div>

            <div className="faq-box">
                <h1 className="scroll-effect">FAQ</h1>
                <div className="question-box">
                    <input name="faq-checks" id="question-1" type="radio" checked={selectedValue === "question-1"} readOnly></input>
                    <label htmlFor="question-1" onClick={() => showAnswer("question-1")}>
                        <h3>What is TechnoInc?</h3>
                        <i className="fa-solid fa-angle-down"></i>
                    </label>
                    <p className="faq-answer">
                        TechnoInc is a singleplayer survival world created by player named GilarInc where player create 
                        civilizations, raid wars, unique arts, and build his own stories in a peristent, player-driven world.
                    </p>
                </div>

                <div className="question-box">
                    <input name="faq-checks" id="question-2" type="radio" checked={selectedValue === "question-2"} readOnly></input>
                    <label htmlFor="question-2" onClick={() => showAnswer("question-2")}>
                        <h3>How do civilizations work?</h3>
                        <i className="fa-solid fa-angle-down"></i>
                    </label>
                    <p className="faq-answer">
                        It's all started from exploration finding a new places, terrains, and structures. A player build a settlement in middle of nowhere 
                        building a unique house and growing as the time passes. That place now has a culture, language, and people on its own which later it's 
                        called a civilization.
                    </p>
                </div>

                <div className="question-box">
                    <input name="faq-checks" id="question-3" type="radio" checked={selectedValue === "question-3"} readOnly></input>
                    <label htmlFor="question-3" onClick={() => showAnswer("question-3")}>
                        <h3>Do I need to learn about history to understand this world?</h3>
                        <i className="fa-solid fa-angle-down"></i>
                    </label>
                    <p className="faq-answer">
                        Not at all. You don't need to learn anything to understand this world, you can dive casually or seriously as you want. 
                        Whether you enjoy building, trading, raiding, or storytelling, there's a place for it.
                    </p>
                </div>

                <div className="question-box">
                    <input name="faq-checks" id="question-4" type="radio" checked={selectedValue === "question-4"} readOnly></input>
                    <label htmlFor="question-4" onClick={() => showAnswer("question-4")}>
                        <h3>Why does player create this world?</h3>
                        <i className="fa-solid fa-angle-down"></i>
                    </label>
                    <p className="faq-answer">
                        It was all started back then a years ago, in 2021 player created a world with the name TechnoInc as a tribute for a legendary Minecraft 
                        player Technoblade, after watching him playing Minecraft on a server. He began to start a new singleplayer survival world with the main focus is 
                        on getting the strongest armor gears and tools, becoming rich of all items. But as the time passed his mind changed and everything was also changed.
                    </p>
                </div>

                <div className="question-box">
                    <input name="faq-checks" id="question-5" type="radio" checked={selectedValue === "question-5"} readOnly></input>
                    <label htmlFor="question-5" onClick={() => showAnswer("question-5")}>
                        <h3>What makes TechnoInc different from other worlds?</h3>
                        <i className="fa-solid fa-angle-down"></i>
                    </label>
                    <p className="faq-answer">
                        Nothing makes this world different from other worlds. It's basically just a regular world like others but contains a unique system and best dedication for worldbuilding level world. 
                        Every world is unique as their own and TechnoInc is a memory keeper for the owner of the world where everything happens matter and will be remembered.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Faq;