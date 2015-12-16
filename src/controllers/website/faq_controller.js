function FaqController($scope, $location) {

	$scope.faq = this;
	this.questions = [
		{
		question: "How secure is PlaceAVote?",
		answer: "More secure than your bank. Your data will be stored in military-grade encryption. We've consulted with the former head of the FBI and the top security experts in the country to make sure our encryption is second to none. Also, there are a few basic threats we are going to actively work on. Session hijacking, Cross-Site Scripting, e.g. general web security. As a team, we’ve been designing and building credit card systems for many years now and not one has been hacked. They've stored millions of credit cards and processed billions in transactions without a security vulnerability. We are bringing that experience to ensure that we can pass all OWASP Top 10 Threats."
		},
		{
		question: "Aren’t we a democratic republic because our founding fathers feared direct democracy?",
		answer: "A democratic republic is the foundation for a representative Democracy.  PlaceAVote is a way to bring that back. PlaceAVote isn’t attempting to change the structure, rather use the tools of our times to break down walls of communication, increase peer to peer collaboration and then vote directly on the bills congress is debating. Existing Congress members can choose to fully represent the will of their constituents because through pav they will know it. Candidates running on a PlaceAVote Platform will fully represent the will of their constituents in all non classified issues."
		},
		{
		question: "Can somebody signup multiple times and get multiple votes?",
		answer: "One validated registered voter only gets one vote."
		},
		{
		question: "How do we know the vote actually went the way PlaceAVote says it did?",
		answer: "By verifying that our published vote counts are accurate (aka that we're not lying to you about the outcome). We will do this by publishing a public key and value file.  Every user will get a new private/public key for every vote they make so they'll be able to lookup their vote to see if it's accurately recorded.  If enough people participate in the audit, the ratio of the \"Yes\" to \"No\" should be very close, if not identical to what we publish."
		},
		{
		question: "Will I be able to delegate (e.g proxy) my vote to someone else?",
		answer: "Absolutely! In fact, the core of our system is to allow people to delegate votes to someone in their community they feel is a better educated or prepared to vote on their behalf. Someone can take their vote back for an individual issue if they want or just give all votes to someone else. You own your vote again, crazy concept."
		},
		{
		question: "What about people that don't have the means to vote online?",
		answer: "We are building a phone system that will allow people to place votes over the phone. Representatives who want to engage their constituents will use part of their 1.4 million dollar annual office budget publish all the bills in the newspaper.  This will allow voters to look up a particular bill that they hear about on TV or read about and then vote on it. We are also exploring a means of creating incentives for a volunteer base of tech savvy people to help the less tech savvy people."
		},
		{
		question: "Who will have access to see my voting history?",
		answer: "Just yourself.   We have strict internal policies on employees accessing data.  We would classify that as an immediate termination and given all the auditing we have on our system it would be impossible for someone to check it unnoticed. We think that looking or sharing voting data for any reason is a gross violation of privacy but we will make it easy for your to share it if you want to."
		},
		{
		question: "Is this service free?",
		answer: "Absolutely.   It’ll remain free for all users, forever.   Access to a voice in government should not require money.  "
		},
		{
		question: "Is there anyway that the candidates that would be voted in could submit their own bill?",
		answer: "Yes, we're building a section to allow districts to author a bill and put the bill before their own districts. Once a district comes to consensus their representative will begin the process of submitting as a proposed bill."
		},
		{
		question: "Would you mind if PlaceAVote gets copied in other countries or emerging democracies around the world?",
		answer: "We actually built the software so any country can use it. We are just in the US so the US is our first target. If anyone wants to roll it out in their country they should shoot us an email and we'll set it up."
		},
		{
		question: "Once the candidate is elected, can everyone in the district vote on the bills or just the people that voted for that candidate during the election?",
		answer: "Unlike our current system that alienates about 50% of those who voted for a losing candidate, Any candidate pledging to represent voters will allow all voters to inform his/her decisions. It's open to all registered voters. The first thing we are going to do when we get into office is use the existing mail ballot system to send everyone a private key, which when combined with a secret like social security number will unlock the right to vote.  We don't care if you voted for another candidate, we know once you start using the system you will see the benefits of focusing on issues over partisan politics and having your voice heard in congress."
		},
		{
		question: "Won’t this lead to \"Mob Rule\"?",
		answer: "If one congressman, in one district, in one house, of one branch of government, representing the will of voting Americans is a danger to the system, then we’ve got bigger problems.  Also the checks and balances of the executive and judicial branches are what protects against mob rule. Who is the best judge of whether or not something will benefit you and your community; you and your neighbors or a politician who received millions from donors with self interested agendas?"
		},
		{
		question: "How are voters verified?",
		answer: "A two step process 1st their info is checked Against current registered voter databases and 2nd users receive a secure private key via us mail.  That 2 step process insures their is no voter fraud and it is more secure than our current system.  "
		},
		{
		question: "How can I trust that PlaceAVote candidates will vote the the way we tell them?",
		answer: "You can never trust fully a politician to do what they say, but no other candidates are even promising to truly listen to your voice.  The majority of the candidates running are not professional politicians.  They are concerned citizens just like you and they are only beholden to you."
		},
		{
		question: "What will your representatives spend their time in office doing if they do not have to fundraise?",
		answer: "PlaceAVote representatives will spend their time getting their district engaged with the software and making sure everyone has access and a voice in Congress."
		}
	];
}

module.exports = FaqController;