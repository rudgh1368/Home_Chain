pragma solidity >=0.4.22 <0.6.0;

import "./ERC20.sol";

/**
 *  construction investment
 */

contract crowdsaleHNC is ERC20{
    address public beneficiary;                     // developer
    uint public fundingGoal;                        // goal money of a contract
    uint public amountRaised;                       // money earned (real monry)
    uint public startTime;
    uint public deadline;
    uint public price;
    mapping(address => uint256) public realMoney;
    bool fundingGoalReached = false;
    bool crowdsaleClosed = false;

    event GoalReached(address recipient, uint totalAmountRaised);
    event FundTransfer(address backer, uint amount, bool isContribution);

    // time check ( exceed time)
    modifier afterDeadline() { if (now >= deadline) _; }
    modifier confirmGoalReached() { if (fundingGoalReached == true) _;}

    /**
     * Constructor
     */
    constructor(
        address ifSuccessfulSendTo,         // developer
        uint _fundingGoal,                  // goal money of a contract (real money)
        uint durationInMinutes,             // the term of a contract
        uint costOfEachToken                // Price per token
    ) public {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = _fundingGoal;
        startTime = now;
        deadline = now + durationInMinutes * 1 minutes;
        price = costOfEachToken;
    }

    /**
     * Invest function
     */
    function invest(uint256 _amount) external {
        require(!crowdsaleClosed);

        uint amount = _amount;
        realMoney[msg.sender] += amount;                    // invested money
        amountRaised += amount;
        ERC20.transfer(msg.sender, amount / price);         // a token payment for one's investment
        emit FundTransfer(msg.sender, amount, true);
    }

    /**
     *  Check money invested so far
     */
    function checkInvent() public view returns(uint256) {
        return amountRaised;
    }

    /**
     * Check if goal was reached
     *
     * Checks if the goal or time limit has been reached and ends the campaign
     *
     * End of investment when you achieve your goal
     */
    function checkGoalReached() public afterDeadline {
        if (amountRaised >= fundingGoal){
            fundingGoalReached = true;
            emit GoalReached(beneficiary, amountRaised);
        }
        crowdsaleClosed = true;
    }


    /**
     * Withdraw the funds
     *
     * Checks to see if goal or time limit has been reached, and if so, and the funding goal was reached,
     * sends the entire amount to the beneficiary. If goal was not reached, each contributor can withdraw
     * the amount they contributed.
     */
    // ((( further development )))
    function safeWithdrawal() public afterDeadline {

        if (!fundingGoalReached) {
            // a bank payment
        }

        if (fundingGoalReached && beneficiary == msg.sender) {
            if (msg.sender.send(amountRaised)) {
                emit FundTransfer(beneficiary, amountRaised, false);
            } else {
                //If we fail to send the funds to beneficiary, unlock funders balance
                fundingGoalReached = false;
            }
        }
    }
}

