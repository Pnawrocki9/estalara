#!/usr/bin/env node

/**
 * Populate FAQ content to Firebase CMS
 * This script adds all FAQ questions from the frontend to the Firebase database
 */

const https = require('https');

const config = {
    databaseURL: "https://estalara-8e22a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "estalara-8e22a"
};

const faqData = {
    general: [
        {
            question: "How does Estalara work?",
            answer: "Estalara connects real estate agents and global investors through livestreaming technology. Agents can broadcast property tours in real-time, while investors from around the world can participate, ask questions, and express interest immediately. Our AI-powered platform handles lead matching, translation, and transaction support."
        },
        {
            question: "Is Estalara available in my country?",
            answer: "Estalara operates in over 50 countries worldwide and supports 25+ languages, making international real estate accessible to investors and agents globally. We provide services across Europe, North America, Latin America, Asia, and the Middle East."
        },
        {
            question: "What languages does Estalara support?",
            answer: "Estalara supports over 25 languages including English, Spanish, French, German, Chinese, Arabic, Portuguese, Italian, Russian, and many more. Our AI-powered translation ensures real-time communication between agents and investors regardless of their native language."
        },
        {
            question: "What is EstalaraAI?",
            answer: "EstalaraAI is our natural language property assistant that provides accurate, hallucination-free responses to questions about properties, markets, legal requirements, and investment opportunities. It supports multiple languages and helps both agents and investors make informed decisions."
        }
    ],
    agents: [
        {
            question: "How do I get started as an agent on Estalara?",
            answer: "Sign up at app.estalara.com, verify your credentials and professional license, complete your agent profile, and start listing properties. Our onboarding process typically takes 24-48 hours for verification. Once approved, you can immediately start livestreaming properties to our global investor network."
        },
        {
            question: "What are the costs for real estate agents?",
            answer: "Estalara offers flexible pricing plans for agents based on their needs. We have options for individual agents, small teams, and large agencies. Plans include per-listing fees, subscription models, and commission-based options. Contact us at agents@estalara.com for detailed pricing information tailored to your requirements."
        },
        {
            question: "How does the AI lead generation work?",
            answer: "Our AI analyzes investor behavior, preferences, search patterns, and engagement during live tours to match them with relevant properties. Agents receive qualified leads with detailed insights about investor interests, budget, and purchase timeline, enabling more effective follow-up. The system learns from each interaction to improve matching accuracy."
        },
        {
            question: "Do I need special equipment for livestreaming?",
            answer: "No special equipment needed! You can livestream directly from your smartphone. Our mobile app includes professional features like image stabilization, filters, and quality optimization. For best results, we recommend good lighting and a stable internet connection."
        },
        {
            question: "How do I handle international transactions?",
            answer: "Estalara provides comprehensive support for cross-border transactions including connections to trusted notaries, title insurance providers, currency exchange services, and legal experts in each market. Our platform guides you through each step of the international transaction process."
        }
    ],
    investors: [
        {
            question: "How secure are international property transactions on Estalara?",
            answer: "Security is our top priority. Estalara verifies all agents and investors, provides secure payment processing, works with trusted notaries and title insurance companies, and ensures legal compliance in all jurisdictions. We use industry-standard encryption and follow GDPR and international data protection regulations. All financial transactions are processed through certified payment providers."
        },
        {
            question: "Can I watch property tours if I can't attend live?",
            answer: "Yes! All live property tours are recorded and available for on-demand viewing. You can watch recordings at your convenience, and our AI assistant can answer questions about properties 24/7. You'll also receive notifications when new tours are scheduled for properties matching your preferences."
        },
        {
            question: "What happens after I express interest in a property?",
            answer: "When you express interest, you're immediately connected with the listing agent who will provide detailed information, arrange private viewings (virtual or in-person), answer questions, and guide you through the purchase process. Our platform facilitates all communication and documentation in your preferred language."
        },
        {
            question: "Are there any fees for investors?",
            answer: "Creating an account and browsing properties on Estalara is completely free for investors. You only pay standard real estate transaction fees when you actually purchase a property. There are no platform fees, subscription costs, or hidden charges for investors."
        },
        {
            question: "Do you provide financing assistance?",
            answer: "While Estalara doesn't directly provide financing, we partner with international mortgage providers and financial institutions who specialize in cross-border real estate transactions. We can connect you with trusted partners who can discuss financing options for your specific situation."
        }
    ],
    technical: [
        {
            question: "Is there a mobile app?",
            answer: "Yes! Estalara is available on both iOS and Android. Download the app from the App Store or Google Play to access all features including live tours, property search, AI assistant, and real-time notifications. The mobile app offers the full functionality of our web platform."
        },
        {
            question: "How do I contact support?",
            answer: "Our support team is available 24/7 via email at support@estalara.com, through the in-app chat feature, or by phone. For agent-specific questions, contact agents@estalara.com. For investor support, reach investors@estalara.com. Average response time is under 2 hours."
        },
        {
            question: "What are your privacy and data policies?",
            answer: "We take privacy seriously and comply with GDPR, CCPA, and international data protection laws. Your personal information is encrypted, never sold to third parties, and only used to provide our services. Read our full Privacy Policy for complete details."
        }
    ]
};

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = `${config.databaseURL}${path}.json`;
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(responseData);
                        resolve(parsed);
                    } catch (e) {
                        resolve(responseData);
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

async function populateFAQ() {
    try {
        console.log('🚀 Starting FAQ population...\n');
        
        // Get existing adminData
        console.log('📥 Loading existing CMS data from Firebase...');
        const existingData = await makeRequest('GET', '/adminData');
        console.log('✅ Loaded existing data\n');
        
        // Update FAQ data
        console.log('📝 Populating FAQ content:');
        console.log(`   - General Questions: ${faqData.general.length} items`);
        console.log(`   - For Agents: ${faqData.agents.length} items`);
        console.log(`   - For Investors: ${faqData.investors.length} items`);
        console.log(`   - Technical & Support: ${faqData.technical.length} items`);
        console.log(`   - Total: ${faqData.general.length + faqData.agents.length + faqData.investors.length + faqData.technical.length} questions\n`);
        
        // Patch FAQ data
        console.log('💾 Saving to Firebase...');
        await makeRequest('PATCH', '/adminData', { faq: faqData });
        console.log('✅ Saved to Firebase\n');
        
        console.log('🎉 SUCCESS! FAQ content has been populated to CMS');
        console.log('\nYou can now view and edit the FAQ questions at:');
        console.log('   cms.html → Content tab → FAQ section\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the population
populateFAQ();
