pragma solidity ^0.5.1;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Ownable.sol";
import "./crowdsaleHNC.sol";
import "./bankCheck.sol";

contract HNC is ERC20, ERC20Detailed, Ownable, crowdsaleHNC, bankCheck{

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

    // bank address
    address bankAddress  = 0xec58179D7BD7CBEd4D1a76376A1c961C61548071;

    uint256 pricePerMoney = 10000; // 현금당 토큰 가격




    // [ developer ]
    constructor(uint256 fundingGoalMonry, uint256 duration)
    ERC20Detailed(_name, _symbol, _decimals)
    crowdsaleHNC(owner(), fundingGoalMonry, duration, pricePerMoney)
    public{
        // token creation
        _mint(owner(), calculateToken(fundingGoalMonry) /*totalSupply*/ * 10**uint256(_decimals));
    }

    function calculateToken(uint256 __fundingGoalMonry) internal pure returns(uint){
        return __fundingGoalMonry / 10000;
    }

    function registerBuilding(
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

    function showBuildingInformation() public view returns(
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

    function investBuilding(bytes32 messageHash,  uint8 v, bytes32 r, bytes32 s, uint256 _amount, uint8 _position) public {
        require(checkBankkey(bankAddress, messageHash, v, r, s)); // bank check

        invest(_amount, _position);
    }

}








