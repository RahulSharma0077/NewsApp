import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsItem from './NewsItem'

export default class Home extends Component {
  constructor() {
    super()
    this.state ={
      articles : [],
      totalResults: 0,
      page:1
    }
  }
    
  async getAPIData(){
    let response = await fetch(`https://newsapi.org/v2/everything?q=${this.props.search?this.props.search:this.props.q}&sortBy=publishedAt&language=${this.props.language}&apiKey=35d315dc4d374a678d730ac18fc154ed`)
    response = await response.json()
    if(response.articles)
    this.setState({
      articles: response.articles.filter((x) => x.title !=="[Removed]"),
      totalResult: response.totalResults

    })
    
  }

  fetchData= async () => {
    this.setState({page:this.state.page+1})
  
    let response = await fetch(`https://newsapi.org/v2/everything?q=${this.props.search?this.props.search:this.props.q}&page=${this.state.page}&sortBy=publishedAt&language=${this.props.language}&apiKey=35d315dc4d374a678d730ac18fc154ed`)
    response = await response.json()
    if(response.articles)
    this.setState({articles: this.state.articles.concat( response.articles.filter((x) => x.title !=="[Removed]"))})
    
  }

  componentDidMount(){
    this.getAPIData()
  }
  componentDidUpdate(oldProps){
    if(oldProps!==this.props)
      this.getAPIData()
  }
  render() {
    return (
      <>
        <h5 className='background text-light text-center p-2 my-1 text-capitalize'>{this.props.search?this.props.search:this.props.q} News Articles</h5>
        <InfiniteScroll
  dataLength={this.state.articles.length} //This is important field to render the next data
  next={this.fetchData}
  hasMore={this.state.articles.length<this.state.totalResults}
  loader={<h4>Loading...</h4>}
  >
        <div className="row">
          {
            this.state.articles.map((item,index)=>{
              return <NewsItem key={index}
              source={item.source.name}
              title={item.title}
              description = {item.description}
              url = {item.url}
              pic = {item.urlToImage}
              date ={item.publishedAt}
              />
            })
          }
          
        </div>
        </InfiniteScroll>
      </>
    )
  }
}
