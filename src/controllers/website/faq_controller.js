function FaqController($scope, $location) {

	$scope.faq = this;
	this.questions = [
		{
		question: "How secure is PlaceAVote?",
		answer: "Your data will be stored in military-grade encryption, making both registration and voting more secure than your online banking. We've consulted with top security experts in the country (including the former head of the FBI) to make sure our encryption is second to none. In addition, there are a few basic threats we will be actively working on such as session hijacking, cross-site scripting, and general web security. As a team, we’ve been designing and building credit card systems for many years and not one of them has ever been hacked - these systems have stored millions of credit cards and processed billions in transactions without a security vulnerability. We have brought that experience to PlaceAVote to ensure we can pass all OWASP top ten threats."
		},
		{
		question: "Aren’t we a democratic republic because our Founding Fathers feared direct democracy?",
		answer: "A democratic republic is the foundation for a representative democracy and PlaceAVote is a way to bring that back. We’re not attempting to change the structure but rather use the tools of our times to break down the walls of communication, increase peer-to-peer collaboration, and vote directly on the bills Congress is debating. Existing Congress members have the option to fully represent the will of their constituents and because through PlaceAVote, they will know it. Candidates running on a PlaceAVote platform will fully represent the will of their constituents on all non-classified issues."
		},
		{
		question: "Can somebody signup multiple times and get multiple votes?",
		answer: "One validated registered voter only gets one vote."
		},
		{
		question: "How do we know the vote actually went the way PlaceAVote says it did?",
		answer: "By verifying that our published vote counts are accurate (in other words, that we're not lying to you about the outcome). PlaceAVote will do this by publishing a public key and value file, where every user will get a new private/public key for every vote they make so they'll be able to look up their vote and see if it's accurately recorded. If enough people participate in the audit, the ratio of the 'Yes' to 'No' should be close, if not identical to what we publish."
		},
		{
		question: "Am I be able to delegate/proxy my vote to someone else?",
		answer: "Yes! In fact, the core of our system is to allow people to delegate votes to someone in their community that they feel is better educated or prepared to vote on their behalf. Someone can either take their vote back for an individual issue or give all their votes to someone else. You own your vote again, crazy concept."
		},
		{
		question: "What about people that don't have the means to vote online?",
		answer: "We are building a phone system that will allow people to vote by calling in and placing their vote over the phone. Representatives who are interested in engaging their constituents will use part of their 1.4 million dollar annual office budget to publish all active bills in the newspaper. This will allow voters to look up a particular bill they’ve heard or read about and vote on it. We are also exploring different ways of establishing creating incentives for tech-savvy volunteers to assist those less tech-savvy."
		},
		{
		question: "Who has access to see my voting history?",
		answer: "Only you. PlaceAVote has strict internal policies on employees accessing data and would classify that as an immediate termination (given all the auditing we have on our system it would be impossible for someone to check it unnoticed). We believe that looking or sharing voting data for any reason is a gross violation of privacy; however, we will make it easy for your to share your vote(s) if you choose to do so."
		},
		{
		question: "Is PlaceAVote free?",
		answer: "Yes, and it will always remain free for all users. Access to a voice in government should not require money."
		},
		{
		question: "Is there a way for candidates voted in to be able to submit their own bill?",
		answer: "Yes. We’re building a section to allow districts to author and put the bill before their own districts. Once a district comes to consensus, their representative can then begin the process of submitting a proposed bill to Congress."
		},
		{
		question: "Would you mind if PlaceAVote gets copied in other countries or emerging democracies around the world?",
		answer: "We actually built the software so any country can use it. We’re currently only in the U.S., but for anyone interested in bringing it their country, please contact us and we will set it up."
		},
		{
		question: "Once the candidate is elected, can everyone in the district vote on the bills or just the people that voted for that candidate during the election?",
		answer: "Unlike our current system, which alienates about 50% of those who voted for a losing candidate, any candidate pledging to represent voters will allow all voters to inform his/her decisions. To put it simply, it's open to all registered voters. Our first priority upon getting into office is to use the existing vote-by-mail system and send everyone a private key. This key, when combined with a secret code (like a social security number) will unlock the right to vote. We don't care if you voted for another candidate. We know that once you start using the system, you will begin to see the benefits of focusing on issues over partisan politics and having your voice heard in congress."
		},
		{
		question: "Won’t this lead to “mob rule?”",
		answer: "If one congressman, in one district, in one house, of one branch of government, representing the will of voting Americans is a danger to the system, then we have bigger problems. Also, don’t forget the checks and balances of the executive and judicial branches, which protects against mob rule. Who is the best judge of whether or not something will benefit you and your community? You and your neighbors, or a politician who received millions from donors with self-interested agendas?"
		},
		{
		question: "How are voters verified?",
		answer: "Voters are verified by a two-step process: (1) their info is checked against a current registered voter database and (2) they will receive a secure private key via U.S. Mail. This two-step process is more secure than our current voting system and helps avoid voter fraud."
		},
		{
		question: "How can I trust that PlaceAVote candidates will vote the way we tell them to?",
		answer: "You can never fully trust a politician to do what they say they’re going to do; however, there are no other candidates even promising to listen to your voice. The majority of the candidates running on PlaceAVote are not professional politicians; they are concerned citizens just like you who want to help and make a difference."
		},
		{
		question: "How will PlaceAVote’s representatives spend their time in office if they don’t have to fundraise?",
		answer: "PlaceAVote representatives will spend their time getting their districts engaged with PlaceAVote’s software, making sure everyone has access to vote and has a voice in Congress."
		}
	];
}
module.exports = FaqController;
