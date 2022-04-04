import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";
import ReactDOM from "react-dom";
import "./ElectionComponent.css";
 
class ElectionComponent extends Component {

  state = { results:[], vote_id:[], lists:[], namee:null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state,               and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance } );

    const counts = await instance.methods.candidatesCount().call();     // Count candidates
    for (var i = 1; i <= counts; i++) {
       let s = await instance.methods.getCandidate(i).call();           // Get candidates names
       this.setState({ lists:[...this.state.lists, s] });
       this.setState({ vote_id:[...this.state.vote_id, i] });

    }
    // alert(     this.state.lists[0] );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  addCandidate = async () => {  

    console.log('adding');
    const { accounts, contract } = this.state;
    await contract.methods.addCandidate(this.state.namee).send({ from: accounts[0] });
    alert(`added`);
    window.location.reload(false);

  };

  Vote = async (inte) => {
    const { accounts, contract } = this.state;
    await contract.methods.vote(inte).send({ from: accounts[0] });   //vote for candidate
    window.location.reload(false);
  };

  getResults = async () => {
    const { accounts, contract } = this.state;

     let s = this.state.vote_id.length;
     for( let i=1; i<=s; i++){
      this.setState({ results:[...this.state.results,  await contract.methods.getCandidateCount(1).call()  ] });
     }
  };

  render() {
   // this.loadCandidate();
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

return ( 
      <div className='center'>

        <h1> Election System </h1>
        <h4>(secured by blockchain)</h4>

        <label> Add Candidate </label>
        <input
          name='cand' 
          type='text'
          onChange={e => this.state.namee = e.target.value}
        />
        <button  onClick={this.addCandidate}>ADD</button>

        <h1> Cast Your Vote </h1>
        <table className='styled-table'> 
            <tbody> 
                <tr key='7'> 
                { 
                    this.state.lists.map
                    ((value)=> <td>{value}</td>)
                }
                </tr>
                <tr key='8'>
                { 
                    this.state.vote_id.map
                    ((value)=><td> <button className='button'
                    onClick={ () =>this.Vote(value)}>Vote {value} </button></td>)
                }
                </tr>
            </tbody> 
        </table>

        <button className='button2' onClick={ () =>this.getResults()}>  <h3>Get Results </h3> </button>
        <table className='styled-table'><tbody>
              <tr key='9'>{
                    this.state.lists.map ((i)=> <td>{i}</td>) }
                    </tr>
                    <tr>{
                    this.state.results.map
                    ((value)=> <td>{value}</td>) }
              </tr></tbody>
        </table>
      </div>
 );} }

export default ElectionComponent;

