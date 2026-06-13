import arc from "../data/article.json";
import "../css/Article.css";

function Article() {

    const trendingArticles = arc.trendingArticles.map(item => {

        // Get the path of url to get the trending article images
        const imgUrl = new URL(item.imageUrl, import.meta.url).href;

        return (
            <div key={item.id} className="article-card">
                <img src={imgUrl}></img>
                <p className="unchanged">{item.title}</p>
            </div>
        )
    });

    const popularCategories = arc.popularCategories.map(item => {

        // Get the path of url to get the popular category images
        const imgUrl = new URL(item.imageUrl, import.meta.url).href;

        return (
            <div key={item.id} className="category-card">
                <img src={imgUrl}></img>
                <div>
                    <p className="unchanged">{item.title}</p>
                    <i className="fa-solid fa-border-all"></i>
                </div>
            </div>
        )
    });

    return (
        <section className="article-container">
            <div className="article-box">
                <h3>Trending articles</h3>
                <div className="article-list">
                    {trendingArticles}
                </div>
            </div>
            <div className="category-box">
                <h3>Popular categories</h3>
                <div className="category-list">
                    {popularCategories}
                </div>
            </div>
        </section>
    );
}

export default Article;