import arc from "../data/article.json";

function Article() {

    return (
        <section className="article-container">
            <div className="article-box">
                <h3>Trending articles</h3>
                <ul>
                    {arc.trendingArticles.map(item => {
                        const test = new URL("../assets/flags/pssr-flag.png", import.meta.url).href;

                        return (
                            <li key={item.id}>
                                <img src={test}></img>
                                <p>{item.title}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    );
}

export default Article;