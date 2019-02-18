pragma solidity ^0.5.1;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Ownable.sol";
import "./crowdsaleHNC.sol";

contract HNC is ERC20, ERC20Detailed, Ownable, crowdsaleHNC{

    // construction information
    struct property{
        string land_information;
        string history;
        string permission;
        string profit_analysis;
        string demo;
        string con_guide;
        string info;
    }
    property prop;

    // Symbol
    string private _name = "Home&Chain";
    string private _symbol = "NHC";
    uint8 private _decimals = 2;

    // bank public key
    bytes32 bankPublicKey = "fjrke4k32";

    // [ developer ]
    constructor(uint256 fundingGoalMonry, uint256 duration, uint256 price, uint256 goalToken)
    ERC20Detailed(_name, _symbol, _decimals)
    crowdsaleHNC(owner(), fundingGoalMonry, duration, price)
    public{
        // token creation
        _mint(owner(), goalToken /*totalSupply*/ * 10**uint256(_decimals));
    }

    function building_register(
        string memory _land_information,
        string memory _history,
        string memory _permission,
        string memory _profit_analysis,
        string memory _demo,
        string memory _con_guide,
        string memory _info
    ) public onlyOwner  {
        prop.land_information = _land_information;
        prop.history =_history;
        prop.permission = _permission;
        prop.profit_analysis = _profit_analysis;
        prop.demo = _demo;
        prop.con_guide = _con_guide;
        prop.info = _info;
    }

    function show() public view returns(
        string memory _land_information,
        string memory _history,
        string memory _permission,
        string memory _profit_analysis,
        string memory _demo,
        string memory _con_guide,
        string memory _info
    ){
        return(
        prop.land_information,
        prop.history,
        prop.permission,
        prop.profit_analysis,
        prop.demo,
        prop.con_guide,
        prop.info
        );
    }
}








