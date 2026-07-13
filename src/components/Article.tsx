import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/Article.css";

interface arcTypes {
    trendingArticles?: itemTypes[]
    popularCategories?: itemTypes[]
}

interface itemTypes {
    title: string
    imageUrl: string
    linkUrl: string
}

function Article() {

    const [arc, setArc] = useState<arcTypes>();

    // Get data from article.json
    useEffect(() => {
        fetch("/data/article.json")
        .then(result => result.json())
        .then(data => setArc(data))
    }, []);

    return (
        <section className="article-container">
            <div className="article-box">
                <h3 className="article-title">
                    <span className="highlight">Trending articles</span>
                </h3>
                <div className="article-list">
                    {arc?.trendingArticles?.map((item, idx) =>
                        <Link key={idx} className="article-card" to={item.linkUrl}>
                            <img src={item.imageUrl}></img>
                            <p className="unchanged">{item.title}</p>
                        </Link>
                    )}
                </div>
            </div>
            <div className="category-box">
                <h3 className="article-title">
                    <span className="highlight">Popular categories</span>
                </h3>
                <div className="category-list">
                    {arc?.popularCategories?.map((item, idx) =>
                        <Link key={idx} className="category-card" to={item.linkUrl}>
                            <img src={item.imageUrl}></img>
                            <div>
                                <p className="unchanged">{item.title} </p>
                                <i className="fa-solid fa-border-all"></i>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Article;