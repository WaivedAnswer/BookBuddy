interface LinkGenerationService {
    generateLink(bookTitle: string, bookAuthor: string) : Promise<LinkResponseData>
}

interface LinkResponseData {
    link: string,
    image: string | null
}

export class AmazonBestSellerLinkGenerator implements LinkGenerationService {
    private bestSellers : Map<string, string> = new Map([
        //Software
        ["Design Patterns: Elements of Reusable Object-Oriented Software", "https://amzn.to/3RgqOMi"],
        ["Clean Code: A Handbook of Agile Software Craftsmanship", "https://amzn.to/4a4e7ww"],
        ["Clean Architecture: A Craftsman's Guide to Software Structure and Design", "https://amzn.to/3GvwDR0"],
        ["Refactoring: Improving the Design of Existing Code", "https://amzn.to/3t2vWLE"],
        ["Code Complete: A Practical Handbook of Software Construction", "https://amzn.to/3Rs0Ne5"],
        ["The Pragmatic Programmer: Your Journey to Mastery", "https://amzn.to/46Owrqy"],
        ["Working Effectively with Legacy Code", "https://amzn.to/4a6VdoH"],
        ["Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems", "https://amzn.to/3GrANcz"],
        ["Domain-Driven Design: Tackling Complexity in the Heart of Software", "https://amzn.to/47K66v6"],
        ["Effective Java", "https://amzn.to/46GjeA1"],
        ["Patterns of Enterprise Application Architecture", "https://amzn.to/4a2Q15l"],
        ["Cracking the Coding Interview", "https://amzn.to/47MzT6n"],
        ["The Clean Coder: A Code of Conduct for Professional Programmers", "https://amzn.to/47G1oi4"],
        ["Test Driven Development: By Example", "https://amzn.to/416jKGe"],
        ["Head First Design Patterns", "https://amzn.to/417Uvn0"],
        //Unknown
        ["Start with Why: How Great Leaders Inspire Everyone to Take Action", "https://amzn.to/41a5ht4"],
        ["The 4-Hour Workweek: Escape 9-5, Live Anywhere, and Join the New Rich", "https://amzn.to/47G4qTu"],
        //Fiction
        ["Hello Beautiful", "https://amzn.to/3NbSwZc"],
        ["Fourth Wing", "https://amzn.to/3Nf0YXI"],
        ["He's Not My Type", "https://amzn.to/3Rqzj8H"],
        ["The Exchange: After The Firm", "https://amzn.to/3N8msVV"],
        ["The Echo of Old Books", "https://amzn.to/46ITnaz"],
        ["Lessons in Chemistry", "https://amzn.to/3t3YVPi"],
        ["The Seven Husbands of Evelyn Hugo", "https://amzn.to/3NcRkok"],
        ["Verity", "https://amzn.to/46PaCqJ"],
        ["Holly", "https://amzn.to/46JQBlm"],
        ["Haunting Adeline", "https://amzn.to/4a4iRSQ"],
        ["It Ends with Us", "https://amzn.to/3R4Bhu5"],
        ["The Four Winds", "https://amzn.to/3Ruph6C"],
        ["All the Light We Cannot See", "https://amzn.to/3RqRQlk"],
        ["Tom Lake", "https://amzn.to/3RbbeRM"],
        ["Mother-Daughter Murder Night", "https://amzn.to/3TazIx5"],
        ["The Housemaid", "https://amzn.to/3GA3lAp"],
        ["A Court of Thorns and Roses", "https://amzn.to/3sUhk13"],
        ["It Starts with Us", "https://amzn.to/483rXO0"],
        ["Demon Copperhead", "https://amzn.to/419WeZh"],
        ["Harry Potter and the Philosopher's Stone", "https://amzn.to/3uTwWlK"],
        ["The Covenant of Water", "https://amzn.to/486lNN3"],
        ["Haunting Adeline", "https://amzn.to/486JWTL"],
        ["The Armor of Light", "https://amzn.to/46KwELi"],
        ["Keep It in the Family", "https://amzn.to/46F0noV"],
        ["Regretting You", "https://amzn.to/4a7pqnK"],
        ["The Keeper of Stories", "https://amzn.to/4a3kNLn"],
        ["The Serpent and the Wings of Night", "https://amzn.to/46IocMS"],
        ["Tomorrow, and Tomorrow, and Tomorrow", "https://amzn.to/4a2XtNN"],
        ["The Housemaid's Secret", "https://amzn.to/46OBzuO"],
        ["Her Deadly Game", "https://amzn.to/416DUAa"],
        ["Ugly Love", "https://amzn.to/3RqAwNg"],
        ["The Fellowship of the Ring", "https://amzn.to/49XZgUe"],
        ["Credence", "https://amzn.to/3Ne48e2"],
        ["Reminders of Him", "https://amzn.to/3ThRWwG"],
        ["None of This Is True", "https://amzn.to/3t4L8bg"],
        ["A Court of Mist and Fury", "A Court of Mist and Fury"],
        ["NERO", "https://amzn.to/3NcmLz8"],
        ["The Shadow Box", "https://amzn.to/3RtPNNq"],
        ["The Perfect Son", "https://amzn.to/3uHN61I"],
        ["Regretting You", "https://amzn.to/3R6QpH9"],
        ["The Midnight Library", "https://amzn.to/4a6WGeB"],
        ["A Court of Wings and Ruin", "https://amzn.to/4a9cTzZ"],
        ["Project Hail Mary", "https://amzn.to/41oioal"],
        ["The Alchemist", "https://amzn.to/419Nq5l"],
        ["A Little Life", "https://amzn.to/416on34"],
        //Mystery
        ["The Silent Patient", "https://amzn.to/47HR09g"],
        ["Never Lie", "https://amzn.to/3tcXEFw"],
        ["Too Late", "https://amzn.to/3uEd8CS"],
        ["The Ritual: A Dark College Romance", "https://amzn.to/3RbS6TE"],
        //Romance
        ["Icebreaker", "https://amzn.to/41a098r"],
        ["The Graham Effect", "https://amzn.to/47Ffv73"],
        ["King of Wrath: An Arranged Marriage Romance", "https://amzn.to/3R5cEgN"],
        ["Things We Never Got Over", "https://amzn.to/3RD0ZYd"],
        ["Mile High", "https://amzn.to/3Gu1Xzm"],
        ["Hopeless", "https://amzn.to/3Gu1Zas"],
        ["Flawless", "https://amzn.to/3GA7rIN"],
        ["Powerless", "https://amzn.to/3GrKk3l"],
        ["Twisted Love", "https://amzn.to/3sUlwhj"],
        //Science Fiction & Fantasy
        ["Iron Flame", "https://amzn.to/3N8y6QY"],
        ["Harry Potter and the Chamber of Secrets", "https://amzn.to/3NcZopo"],
        ["The Ashes and the Star-Cursed King", "https://amzn.to/3Ne8JNk"],
        ["Dune", "https://amzn.to/3RrWD5P"],
        ["Throne of Glass", "https://amzn.to/46HJxpG"],
        ["A Game of Thrones", "https://amzn.to/46GsZ17"],
        ["The Two Towers", "https://amzn.to/3RtFFnR"],
        ["The Return of the King", "https://amzn.to/46IRTxd"],
        ["The Hitchhiker's Guide To The Galaxy", "https://amzn.to/3uQY3hj"],
        ["The Hobbit", "https://amzn.to/3uGB4FP"],
        ["The Way of Kings", "https://amzn.to/3R0vhSQ"],
        ["The Silmarillion", "https://amzn.to/3R6EdpT"],
        ["The Name of the Wind", "https://amzn.to/41a1xIb"],
        ["The Stand", "https://amzn.to/41fyFOz"],
        ["Skyward", "https://amzn.to/3R6YxaL"],
        //Biography
        ["The Woman in Me", "https://amzn.to/46Luw6f"],
        ["Friends, Lovers, and the Big Terrible Thing: A Memoir", "https://amzn.to/3GqfrMG"],
        ["My Name Is Barbra", "https://amzn.to/416bExm"],
        ["My Effin' Life", "https://amzn.to/47ZFG8k"],
        ["Oath and Honor: A Memoir and a Warning", "https://amzn.to/482UYsZ"],
        ["The Road Years: A Memoir, Continued . . .", "https://amzn.to/3GrAZs2"],
        ["Taylor Swift: A Little Golden Book Biography", "https://amzn.to/3uMfIab"],
        ["Be Useful: Seven Tools for Life", "https://amzn.to/3sVwRh8"],
        ["Can't Hurt Me: Master Your Mind and Defy the Odds", "https://amzn.to/46JMYfe"],
        ["Elon Musk", "https://amzn.to/3GvyTaW"],
        ["Poor Charlie’s Almanack: The Essential Wit and Wisdom of Charles T. Munger", "https://amzn.to/3GtB3aV"],
        ["Making It So: A Memoir", "https://amzn.to/47J4FwQ"],
        ["Greenlights", "https://amzn.to/3NcQWXc"],
        ["Man's Search for Meaning", "https://amzn.to/41a8853"],
        ["The Storyteller: Tales of Life and Music", "https://amzn.to/41a8997"],
        //Business
        ["Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones", "https://amzn.to/3uLhqIQ"],
        ["Atomic Habits", "https://amzn.to/3uLhqIQ"],
        ["Hidden Potential: The Science of Achieving Greater Things", "https://amzn.to/3Gv2QrG"],
        ["The Psychology of Money: Timeless lessons on wealth, greed, and happiness", "https://amzn.to/4a6Sn2V"],
        ["The 48 Laws of Power", "https://amzn.to/3RbN9dN"],
        ["The 4-Hour Workweek, Expanded and Updated", "https://amzn.to/3Rs3qwi"],
        ["How to Talk to Anyone: 92 Little Tricks for Big Success in Relationships", "https://amzn.to/480xmp0"],
        ["The Subtle Art of Not Giving a F*ck: A Counterintuitive Approach to Living a Good Life", "https://amzn.to/486i4ix"],
        ["Rich Dad Poor Dad: What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!", "https://amzn.to/47ZYTH5"],
        ["Mastery", "https://amzn.to/4a2TAZd"],
        ["The 7 Habits of Highly Effective People", "https://amzn.to/3Gv3hSG"],
        ["How to Win Friends and Influence People", "https://amzn.to/46OyZVE"],
        ["Think And Grow Rich", "https://amzn.to/46JOk9O"],
        ["The Art of War", "https://amzn.to/3t62a8X"],
        ["12 Rules for Life: An Antidote to Chaos", "https://amzn.to/46Lwaor"],
        ["The Intelligent Investor: The Definitive Book on Value Investing", "https://amzn.to/3uOiLyI"],
        ["Never Split the Difference: Negotiating as if Your Life Depended on It", "https://amzn.to/3t2QiVb"],
        //Health
        ["The Body Keeps the Score: Brain, Mind, and Body in the Healing of Trauma", "https://amzn.to/4a3yfyO"],
        ["The Creative Act: A Way of Being", "https://amzn.to/3TcDy9i"],
        ["Outlive: The Science and Art of Longevity", "https://amzn.to/3Tb3HW2"],
        ["Stop Overthinking: 23 Techniques to Relieve Stress, Stop Negative Spirals, Declutter Your Mind, and Focus on the Present", "https://amzn.to/3T94WES"],
        ["It Didn't Start with You: How Inherited Family Trauma Shapes Who We Are and How to End the Cycle", "https://amzn.to/3Gs7bvp"],
        ["When the Body Says No: The Cost of Hidden Stress", "https://amzn.to/4a7ndIY"],
        ["The Four Agreements: A Practical Guide to Personal Freedom", "https://amzn.to/3Grf4kS"],
        ["The Courage to Be Disliked : How to Free Yourself, Change Your Life and Achieve Real Happiness", "https://amzn.to/4a3ykT8"],
        ["The Myth of Normal: Trauma, Illness and Healing in a Toxic Culture", "https://amzn.to/3T3ZcMO"],
        ["Unfu*k Yourself: Get Out of Your Head and into Your Life", "https://amzn.to/46ILXEr"],
        ["The Boy, the Mole, the Fox and the Horse: A Great Gift for Book Lovers", "https://amzn.to/3uHCQqm"],
        ["The Blue Zones Kitchen: 100 Recipes to Live to 100", "https://amzn.to/3uOk14U"],
        ["The 4-Hour Body: An Uncommon Guide to Rapid Fat-Loss, Incredible Sex, and Becoming Superhuman", "https://amzn.to/41aWNlC"],
        ["Attached: The New Science of Adult Attachment and How It Can Help You Find—and Keep—Love", "https://amzn.to/46LxxU7"],
        //History
        ["Meditations: A New Translation", "https://amzn.to/3uMioof"],
        ["Meditations", "https://amzn.to/3uMioof"],
        ["Spare", "https://amzn.to/4a6VjMZ"],
        ["Sapiens: A Brief History of Humankind", "https://amzn.to/3RbQ0Dx"],
        ["Talking to Strangers: What We Should Know About the People We Don't Know", "https://amzn.to/4a5SFXN"],
        ["Emperor of Rome: Ruling the Ancient Roman World", "https://amzn.to/49ZGigd"],
        ["A Promised Land", "https://amzn.to/3GtMaAD"],
        ["The Boys in the Boat: Nine Americans and Their Epic Quest for Gold at the 1936 Berlin Olympics", "https://amzn.to/3NAklL9"],
        ["The Diary of a Young Girl: The Definitive Edition", "https://amzn.to/3Ncnkc9"],
        ["Extreme Ownership: How U.S. Navy SEALs Lead and Win", "https://amzn.to/3Rs6dFM"],
        ["Letters from a Stoic", "https://amzn.to/415tYa1"],
        ["The War on the West", "https://amzn.to/3t8qwyI"],
        ["Homo Deus: A Brief History of Tomorrow", "https://amzn.to/3RtOYUQ"],
        ["Mythos: A Retelling of the Myths of Ancient Greece", "https://amzn.to/3RaYbji"],
        ["Invisible Women: Data Bias in a World Designed for Men", "https://amzn.to/3RsK6iJ"],
        ["Endurance: Shackleton's Incredible Voyage", "https://amzn.to/3Rs4O29"],
        ["21 Lessons for the 21st Century", "https://amzn.to/3R7h9aA"],
        ["The Fourth Turning: What the Cycles of History Tell Us About America's Next Rendezvous with Destiny", "https://amzn.to/3T7jt3V"],
        ["A Short History of Nearly Everything", "https://amzn.to/3Rve4CN"],
        //Entertainment
        ["Things To Do While You Poo On The Loo", "https://amzn.to/3Gv9RZg"],
        ["The Book of Unusual Knowledge", "https://amzn.to/47XhaVk"],
        ["Less", "https://amzn.to/484oZbO"],
        ["Born a Crime: Stories from a South African Childhood", "https://amzn.to/47YWcWc"],
        ["Taylor Swift: The Whole Story", "https://amzn.to/3T6JIHX"],
        ["Minecraft: The Official Joke Book", "https://amzn.to/47Cxv1Y"],
        ["Shit I Can't Remember", "https://amzn.to/482hXEt"],
        ["Interesting Stories For Curious People", "https://amzn.to/486IZe9"],
        ["The Ultimate Dad Joke Book", "https://amzn.to/3uKHZxK"],
        //Self Help
        ["101 Essays That Will Change The Way You Think", "https://amzn.to/3TeuTmz"],
        ["The 5AM Club: Own Your Morning. Elevate Your Life.", "https://amzn.to/3Tc2TAa"],
        ["Atlas of the Heart: Mapping Meaningful Connection and the Language of Human Experience", "https://amzn.to/3sVJnx8"],
        ["The Power of Now", "https://amzn.to/3sU5ggl"],
        ["The 5 Second Rule: Transform your Life, Work, and Confidence with Everyday Courage", "https://amzn.to/486Oyt3"],
        ["Becoming Supernatural: How Common People Are Doing the Uncommon", "https://amzn.to/3uMoCED"],
        ["Breaking the Habit of Being Yourself", "https://amzn.to/4a3pswR"],
        ["Tuesdays with Morrie: An Old Man, a Young Man, and Life's Greatest Lesson", "https://amzn.to/47EwQxd"],
        ["Master Your Emotions: A Practical Guide to Overcome Negativity and Better Manage Your Feelings", "https://amzn.to/3NcWmkI"],
        ["Think Like a Monk: Train Your Mind for Peace and Purpose Every Day", "https://amzn.to/47Eu6Qc"],
        ["Four Thousand Weeks: Time Management for Mortals", "https://amzn.to/482nJWF"],
    ]);

    async generateLink(bookTitle: string, bookAuthor: string): Promise<LinkResponseData> {
        const newLink = this.bestSellers.get(bookTitle)
        if(newLink) {
            return {link: newLink, image: null}
        } else {
            return fetch("https://sc2slkrny7rmct6gtx7h5gwwt40lonrx.lambda-url.us-east-2.on.aws/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookTitle: bookTitle,
                    bookAuthor: bookAuthor
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json()
            })
            .then((responseData : LinkResponseData) => {
                if(!responseData.link) {
                    throw new Error('Failed to retrieve link. Try again.')
                }
                return responseData
            })
        }
    }

}
class FakeLinkGenerationService implements LinkGenerationService {
    async generateLink(bookTitle: string, bookAuthor: string): Promise<LinkResponseData> {
        await new Promise(r => setTimeout(r, 2000));
        return {link: getFixedLink(bookTitle), image: this.getImage()}
    }

    getImage() {
        const images = ["https://m.media-amazon.com/images/I/51Yf9AHpFGL._AC_UL320_.jpg", 
        "https://m.media-amazon.com/images/I/91vnzZO5yPL._AC_UL320_.jpg", 
        "https://m.media-amazon.com/images/I/91JSuY8aT-L._AC_UL320_.jpg", 
        "https://m.media-amazon.com/images/I/71PcexlBwQL._AC_UL320_.jpg", 
        null, 
        null, 
        "https://m.media-amazon.com/images/I/81zk7by9jXL._AC_UL640_FMwebp_QL65_.jpg", 
        "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UL640_FMwebp_QL65_.jpg",
        "https://m.media-amazon.com/images/I/91zJxacOUcL._AC_UL640_FMwebp_QL65_.jpg",
        "https://m.media-amazon.com/images/I/61BRxtp9qtL._AC_UL640_FMwebp_QL65_.jpg"
    ]
        const imageIndex = Math.floor(Math.random() * images.length)
        return images[imageIndex]
    }
}

export function getFixedLink(bookTitle: string) {
   return "https://www.amazon.ca/s?k=" + bookTitle.replaceAll(" ", "+") + "&tag=myread0a-20"
}

export function getLinkGenerationService() {
    if(process.env.NODE_ENV === 'production' || process.env.REACT_APP_REC_SERVICE === "true") {
        return new AmazonBestSellerLinkGenerator()
    } else {
        return new FakeLinkGenerationService()
    }

}

export type {
    LinkGenerationService
}