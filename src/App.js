import React from 'react';

export default class Products extends React.Component {
	constructor() {
		super();
		this.state = {
			apidata: [],
			sortBy: '',
			page: 1,
			isLoading:true
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.fetchProductData = this.fetchProductData.bind(this);
	}
	componentDidMount() {
		this.fetchProductData(1);
		window.addEventListener('scroll', this.handleScroll);
	}
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll() {
		const container = document.getElementById('container');
		const scrollHeight = container.offsetTop + container.clientHeight - window.outerHeight;
	if (window.scrollY >= scrollHeight && scrollHeight >0 && this.state.page <10 && !this.state.isLoading)  {
			this.setState({isLoading:true})
			setTimeout(() =>{	 this.fetchProductData(this.state.page + 1)},3000)
		}
	
	}

	fetchProductData(page) {
	
		fetch(`http://localhost:3002/api/products?_page=${page}&_limit=20`)
			.then((data) => data.json())
			.then((json) => {
				const apidata = this.state.apidata.concat(json);
				this.setState({ apidata, page,isLoading:false });
			})
			.catch((err) => console.log(err));
	}

	handleSort = (e) => {
		fetch(`http://localhost:3002/api/products?_page=1&_limit=${this.state.page * 20}&_sort=${e.target.value}`)
			.then((data) => data.json())
			.then((json) => this.setState({ apidata: json }))
			.catch((err) => console.log(err));
	};

	dateFormatter = (date) => {
		const dateObj = new Date(date);
		const today = new Date(Date.now());
		const daysBefore = dateObj.getDate();
		const todayDate = today.getDate();

		if (dateObj.getFullYear() === today.getFullYear() && dateObj.getMonth() === today.getMonth() && todayDate-daysBefore <= 7) {
			return `${todayDate-daysBefore} days ago`;
		} else {
			return `${dateObj.getDate()}/${dateObj.getMonth()+1}/${dateObj.getFullYear()}`;
		}
	};
	render() {
		const { apidata,page,isLoading } = this.state;
		console.log(apidata)
console.log(page)
		return (
			<React.Fragment>
				<label htmlFor="sort">Sort By:</label>
				<select name="sort" onChange={this.handleSort}>
					<option value="id">Id</option>
					<option value="size">Size</option>
					<option value="price">Price</option>
				</select>
				
				<div id="container" className="container">
					{apidata.length > 0 &&
						apidata.map((data, index) => {
							return (
								<React.Fragment>
									<div className="faces" key={data.id}>
										<div
											style={{
												padding: 'auto',
												marginTop: '0px'
											}}
										>
											<p style={{ fontSize: data.size, textAlign: 'center' }}>{data.face}</p>
										</div>
										<div className="desc">Size: {data.size}</div>
										<div className="desc">Price: ${data.price/100}</div>
										<div className="desc">Date: {this.dateFormatter(data.date)}</div>
									</div>
									{(index + 1) % 20 === 0 && (
										<div className="addContainer" key={index}>
											<img
												className="ad"
												src={`http://localhost:3002/ads/?r=${Math.floor(Math.random() * 1000)}`}
											/>
										</div>
									)}
								</React.Fragment>
							);
						})}
					{isLoading ?<div  className="greenText"><p>Loading items....</p></div>:null}
					{page === 10? <div className="greenText" ><p> end of catalogue </p></div>:null}
				</div>
			</React.Fragment>
		);
	}
}
