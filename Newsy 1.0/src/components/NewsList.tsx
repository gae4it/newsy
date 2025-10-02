import React from 'react';

interface NewsItem {
  title: string;
  summary: string;
}

interface NewsListProps {
  news: NewsItem[];
}

const NewsList: React.FC<NewsListProps> = ({ news }) => {
  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
