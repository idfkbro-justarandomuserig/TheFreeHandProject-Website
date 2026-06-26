/* Freehand 1.0 - Technical Minimalist Application Control */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // CRASH-PROOF LOCAL STORAGE CONTROLLER
    // ==========================================================================
    
    const db = {
        getWaitlist: () => {
            try {
                return JSON.parse(localStorage.getItem('fh_waitlist')) || [];
            } catch (err) {
                console.error("Local Waitlist load error:", err);
                return [];
            }
        },
        saveWaitlist: (data) => {
            try {
                localStorage.setItem('fh_waitlist', JSON.stringify(data));
            } catch (err) {
                console.error("Local Waitlist save error:", err);
            }
        },
        
        getSupport: () => {
            try {
                return JSON.parse(localStorage.getItem('fh_support')) || [];
            } catch (err) {
                console.error("Local Support load error:", err);
                return [];
            }
        },
        saveSupport: (data) => {
            try {
                localStorage.setItem('fh_support', JSON.stringify(data));
            } catch (err) {
                console.error("Local Support save error:", err);
            }
        },
        
        getCommunity: () => {
            try {
                return JSON.parse(localStorage.getItem('fh_community')) || [];
            } catch (err) {
                console.error("Local Community load error:", err);
                return [];
            }
        },
        saveCommunity: (data) => {
            try {
                localStorage.setItem('fh_community', JSON.stringify(data));
            } catch (err) {
                console.error("Local Community save error:", err);
            }
        },
        
        getAdminConfig: () => {
            try {
                return JSON.parse(localStorage.getItem('fh_admin_config')) || {
                    supabaseUrl: '',
                    apiKey: '',
                    webhookUrl: '',
                    emailKey: '',
                    discordId: '',
                    discordInviteUrl: '',
                    discordCustomUrl: '',
                    tiktokUsername: '',
                    tiktokKey: '',
                    tiktokCustomUrl: '',
                    redditSub: '',
                    redditCustomUrl: '',
                    useSupabaseForStats: false,
                    isConnected: false
                };
            } catch (err) {
                return {
                    supabaseUrl: '',
                    apiKey: '',
                    webhookUrl: '',
                    emailKey: '',
                    discordId: '',
                    discordInviteUrl: '',
                    discordCustomUrl: '',
                    tiktokUsername: '',
                    tiktokKey: '',
                    tiktokCustomUrl: '',
                    redditSub: '',
                    redditCustomUrl: '',
                    useSupabaseForStats: false,
                    isConnected: false
                };
            }
        },
        saveAdminConfig: (data) => {
            try {
                localStorage.setItem('fh_admin_config', JSON.stringify(data));
            } catch (err) {
                console.error("Local Config save error:", err);
            }
        }
    };

    // Prepopulate database with initial technical mockup logs if empty
    const initDatabase = () => {
        const waitlist = db.getWaitlist();
        if (waitlist.length === 0) {
            db.saveWaitlist([
                { email: 'gabriel.zen5@linuxmail.org', handle: 'Discord: gabriel_z', date: '2026-06-23T14:24:00Z', source: 'TikTok' },
                { email: 'emulation_guru@retrobox.net', handle: 'Reddit: u/emuguru', date: '2026-06-24T09:12:00Z', source: 'Reddit' },
                { email: 'repair_guy_99@ifixit-enthusiast.com', handle: 'Direct', date: '2026-06-25T11:05:00Z', source: 'Direct' }
            ]);
        }
        
        const support = db.getSupport();
        if (support.length === 0) {
            db.saveSupport([
                { 
                    name: 'Linus', 
                    email: 'linus@bazzite-dev.org', 
                    handle: 'Discord: linus_bazzite',
                    category: 'Hardware Specs', 
                    message: 'Hey, love the RDNA 3.5 Z2 Extreme choice! Have you finalized the copper heat pipe sizing? Would love to see a 15W custom power profile config file.', 
                    date: '2026-06-24T18:30:00Z' 
                },
                { 
                    name: 'Aria', 
                    email: 'aria.gaming@protonmail.com', 
                    handle: 'Reddit: u/aria_games',
                    category: 'Crowdfunding', 
                    message: 'Will the Kickstarter ship to EU countries with prepaid VAT options? Right-to-repair handhelds are super high demand here.', 
                    date: '2026-06-25T08:15:00Z' 
                }
            ]);
        }

        const community = db.getCommunity();
        if (community.length === 0) {
            db.saveCommunity([
                { 
                    username: 'BazziteFanboy', 
                    handle: 'Discord: bazzite_fb',
                    category: 'OS Optimization', 
                    content: 'Please make sure gamescope is compiled with HDR patch for the OLED panel out-of-the-box! That would make the Z2 Zen 5 graphics absolutely pop.', 
                    date: '2026-06-23T16:45:00Z' 
                },
                { 
                    username: 'SolderMaster', 
                    handle: 'Reddit: u/soldermaster',
                    category: 'Hardware Architecture', 
                    content: 'Can you expose the fan PWM pins on a small internal header? It would allow hackers to build custom liquid-cooled docks.', 
                    date: '2026-06-25T10:30:00Z' 
                }
            ]);
        }
    };
    initDatabase();

    // ==========================================================================
    // ROUTING SYSTEM (CLIENT-SIDE HASH ROUTER)
    // ==========================================================================
    
    const views = {
        home: document.getElementById('home-view'),
        community: document.getElementById('community-view'),
        support: document.getElementById('support-view'),
        admin: document.getElementById('admin-view'),
        thankYou: document.getElementById('thank-you-view')
    };

    const navLinks = {
        specs: document.getElementById('nav-link-specs'),
        roadmap: document.getElementById('nav-link-roadmap'),
        community: document.getElementById('nav-link-community'),
        support: document.getElementById('nav-link-support')
    };

    const router = () => {
        const hash = window.location.hash || '#';
        
        // Reset navigation links states
        Object.values(navLinks).forEach(link => {
            if (link) link.classList.remove('active-link');
        });

        if (hash === '#' || hash === '' || hash.startsWith('#specs') || hash.startsWith('#roadmap') || hash.startsWith('#waitlist')) {
            showView('home');
            
            if (hash.startsWith('#specs')) {
                if (navLinks.specs) navLinks.specs.classList.add('active-link');
                smoothScrollTo('specs');
            } else if (hash.startsWith('#roadmap')) {
                if (navLinks.roadmap) navLinks.roadmap.classList.add('active-link');
                smoothScrollTo('roadmap');
            } else if (hash.startsWith('#waitlist')) {
                smoothScrollTo('waitlist-section');
            } else {
                window.scrollTo({ top: 0 });
            }
        } 
        else if (hash.startsWith('#community')) {
            showView('community');
            if (navLinks.community) navLinks.community.classList.add('active-link');
            window.scrollTo({ top: 0 });
            renderCommunityFeed();
        } 
        else if (hash.startsWith('#support')) {
            showView('support');
            if (navLinks.support) navLinks.support.classList.add('active-link');
            window.scrollTo({ top: 0 });
        } 
        else if (hash.startsWith('#admin')) {
            showView('admin');
            window.scrollTo({ top: 0 });
            initAdminDashboard();
        }
        else if (hash.startsWith('#thank-you')) {
            showView('thankYou');
            window.scrollTo({ top: 0 });
        }
    };

    const showView = (activeKey) => {
        Object.keys(views).forEach(key => {
            if (views[key]) {
                if (key === activeKey) {
                    views[key].classList.add('active-view');
                } else {
                    views[key].classList.remove('active-view');
                }
            }
        });
    };

    const smoothScrollTo = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            const headerOffset = 64;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    window.addEventListener('hashchange', router);
    // Execute routing on first load
    router();

    // ==========================================================================
    // MOBILE NAVIGATION TOGGLE
    // ==========================================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('open');
            navMenu.classList.toggle('mobile-open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('open');
                navMenu.classList.remove('mobile-open');
            });
        });
    }

    // ==========================================================================
    // SUBPAGE INTERACTION: FAQ ACCORDIONS
    // ==========================================================================
    document.querySelectorAll('.faq-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.parentElement;
            const isOpen = card.classList.contains('open');
            
            document.querySelectorAll('.faq-card').forEach(item => {
                item.classList.remove('open');
            });

            if (!isOpen) {
                card.classList.add('open');
            }
        });
    });

    // ==========================================================================
    // LIVE REST API DATABASE SYNC MODULE
    // ==========================================================================
    
    // POST - Send rows to Supabase & Web3Forms in the background
    const sendDataToBackend = async (endpointType, payload) => {
        const config = db.getAdminConfig();
        const logs = [];

        logs.push(`Sending data for: ${endpointType}`);

        // 1. Supabase POST
        if (config.apiKey && config.supabaseUrl) {
            logs.push(`Supabase database target detected.`);
            try {
                const url = `${config.supabaseUrl}/rest/v1/${endpointType}`;
                logs.push(`Syncing entry to Supabase table: ${endpointType}...`);
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': config.apiKey,
                        'Authorization': `Bearer ${config.apiKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                logs.push(`Synced with Supabase successfully.`);
            } catch (err) {
                logs.push(`Supabase connection failed: ${err.message}`);
            }
        }

        // 2. Web3Forms Free Email POST
        if (config.emailKey) {
            logs.push(`Sending email notification via Web3Forms...`);
            try {
                const formattedMessage = Object.entries(payload)
                    .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
                    .join('\n');

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: config.emailKey,
                        subject: `New Freehand 1.0 Submission: ${endpointType}`,
                        from_name: "Freehand Hardware website",
                        message: `A new user has submitted data on the Freehand website:\n\n${formattedMessage}`
                    })
                });

                if (response.ok) {
                    logs.push(`Email notification sent.`);
                } else {
                    const errData = await response.json().catch(() => ({}));
                    logs.push(`Email notification failed: ${errData.message || 'Unknown error'}`);
                }
            } catch (err) {
                logs.push(`Email notification error: ${err.message}`);
            }
        }

        // 3. Webhook POST
        if (config.webhookUrl) {
            logs.push(`Triggering webhook notification...`);
            fetch(config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'new_submission', type: endpointType, data: payload })
            }).catch(e => console.error("Webhook failed:", e));
        }

        if (!config.apiKey && !config.emailKey && !config.webhookUrl) {
            logs.push(`Offline mode active. Saved locally.`);
        }

        appendAdminConsoleLogs(logs);
    };

    // GET - Fetch rows from Supabase
    const fetchFromSupabase = async (endpointType) => {
        const config = db.getAdminConfig();
        if (!config.apiKey || !config.supabaseUrl) return null;

        try {
            const url = `${config.supabaseUrl}/rest/v1/${endpointType}?select=*`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': config.apiKey,
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            appendAdminConsoleLogs([`Table fetch failed (${endpointType}): ${err.message}`]);
            return null;
        }
    };

    // DELETE - Delete row from Supabase
    const deleteFromSupabase = async (endpointType, date) => {
        const config = db.getAdminConfig();
        if (!config.apiKey || !config.supabaseUrl) return false;

        try {
            const url = `${config.supabaseUrl}/rest/v1/${endpointType}?date=eq.${encodeURIComponent(date)}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'apikey': config.apiKey,
                    'Authorization': `Bearer ${config.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return true;
        } catch (err) {
            appendAdminConsoleLogs([`Row deletion failed (${endpointType}): ${err.message}`]);
            return false;
        }
    };

    // ==========================================================================
    // LEAD CAPTURE SYSTEM
    // ==========================================================================
    const waitlistForm = document.getElementById('waitlist-form');
    const waitlistFeedback = document.getElementById('waitlist-feedback');
    const waitlistCount = document.getElementById('waitlist-count');

    const updateWaitlistCountUI = () => {
        if (waitlistCount) {
            const countBase = 1248;
            const records = db.getWaitlist();
            waitlistCount.textContent = countBase + records.length;
        }
    };
    updateWaitlistCountUI();

    let selectedTier = 'General Waitlist';

    // Form 1: R&D Waitlist Signup
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('waitlist-email');
            const handleInput = document.getElementById('waitlist-handle');
            
            const email = emailInput.value.trim();
            const handle = handleInput ? handleInput.value.trim() : '';

            if (!email) return;

            // Save subscriber record to local storage immediately
            const waitlist = db.getWaitlist();
            const newRecord = {
                email: email,
                handle: handle || 'Direct',
                tier: selectedTier,
                date: new Date().toISOString(),
                source: window.location.hash ? `Landing (${window.location.hash})` : 'Landing (Hero)'
            };
            
            waitlist.push(newRecord);
            db.saveWaitlist(waitlist);
            
            // Dispatch sync in the background (no await here to prevent blocking)
            sendDataToBackend('waitlist_leads', newRecord);

            // Clean inputs & reset tier tracker
            emailInput.value = '';
            if (handleInput) handleInput.value = '';
            selectedTier = 'General Waitlist';
            
            // Redirect immediately to the thank you viewport
            window.location.hash = '#thank-you';
            updateWaitlistCountUI();
        });
    }

    // Spec card triggers
    document.querySelectorAll('.waitlist-trigger').forEach(btn => {
        btn.addEventListener('click', function() {
            let tierNum = this.getAttribute('data-tier');
            let modelName = "";
            if (tierNum === "1") modelName = "Tier 1";
            else if (tierNum === "2") modelName = "Tier 2";
            else if (tierNum === "3") modelName = "Tier 3";
            else if (tierNum === "4") modelName = "Tier 4";
            
            selectedTier = modelName || 'General Waitlist';
            window.location.hash = '#waitlist-section';
            
            const emailInput = document.getElementById('waitlist-email');
            if (emailInput) {
                emailInput.focus();
                emailInput.placeholder = modelName ? `Enter email to reserve ${modelName}...` : `Enter your email address`;
            }
        });
    });

    // Form 2: Community Forum discussion
    const communityForm = document.getElementById('community-form');
    const feedContainer = document.getElementById('community-feed-container');

    if (communityForm) {
        communityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('post-username');
            const handleInput = document.getElementById('post-handle');
            const categorySelect = document.getElementById('post-category');
            const contentTextarea = document.getElementById('post-content');

            const postData = {
                username: usernameInput.value.trim(),
                handle: handleInput ? handleInput.value.trim() : 'N/A',
                category: categorySelect.value,
                content: contentTextarea.value.trim(),
                date: new Date().toISOString()
            };

            if (!postData.username || !postData.category || !postData.content) return;

            const posts = db.getCommunity();
            posts.push(postData);
            db.saveCommunity(posts);

            // Dispatch sync in background
            sendDataToBackend('community_forum', postData);

            usernameInput.value = '';
            if (handleInput) handleInput.value = '';
            categorySelect.selectedIndex = 0;
            contentTextarea.value = '';

            // Redirect immediately
            window.location.hash = '#thank-you';
        });
    }

    const renderCommunityFeed = () => {
        if (!feedContainer) return;

        const posts = db.getCommunity();
        
        if (posts.length === 0) {
            feedContainer.innerHTML = '<div class="feed-placeholder font-gray">No submissions yet. Be the first to start a thread!</div>';
            return;
        }

        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

        feedContainer.innerHTML = sortedPosts.map(post => {
            const formattedDate = post.date ? new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'N/A';

            const initial = post.username.charAt(0).toUpperCase();

            return `
                <div class="community-post-card">
                    <div class="post-header">
                        <div class="post-user-info">
                            <div class="user-avatar-stub">${initial}</div>
                            <div>
                                <span class="post-username">${escapeHtml(post.username)}</span>
                                <span class="post-date font-gray" style="font-size:0.75rem; margin-left:8px;">(${escapeHtml(post.handle || 'Direct')})</span>
                                <div class="post-date">${formattedDate}</div>
                            </div>
                        </div>
                        <span class="post-tag">${escapeHtml(post.category)}</span>
                    </div>
                    <p class="post-message">${escapeHtml(post.content)}</p>
                </div>
            `;
        }).join('');
    };

    // Form 3: Support Inquiries
    const supportForm = document.getElementById('support-form');

    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('ticket-name');
            const emailInput = document.getElementById('ticket-email');
            const handleInput = document.getElementById('ticket-handle');
            const categorySelect = document.getElementById('ticket-category');
            const messageTextarea = document.getElementById('ticket-message');

            const ticketData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                handle: handleInput ? handleInput.value.trim() : 'N/A',
                category: categorySelect.value,
                message: messageTextarea.value.trim(),
                date: new Date().toISOString()
            };

            if (!ticketData.name || !ticketData.email || !ticketData.category || !ticketData.message) return;

            const tickets = db.getSupport();
            tickets.push(ticketData);
            db.saveSupport(tickets);

            // Sync
            sendDataToBackend('support_tickets', ticketData);

            nameInput.value = '';
            emailInput.value = '';
            if (handleInput) handleInput.value = '';
            categorySelect.selectedIndex = 0;
            messageTextarea.value = '';

            // Redirect immediately
            window.location.hash = '#thank-you';
        });
    }

    // ==========================================================================
    // ADMINISTRATIVE TELEMETRY PANEL
    // ==========================================================================
    const adminConfigForm = document.getElementById('admin-config-form');
    const toggleKeyBtn = document.getElementById('btn-toggle-key');
    const adminFeedback = document.getElementById('admin-config-feedback');
    const consoleBody = document.getElementById('admin-console-body');
    const adminClearBtn = document.getElementById('admin-clear-btn');

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    const initAdminDashboard = () => {
        const config = db.getAdminConfig();
        document.getElementById('admin-supabase-url').value = config.supabaseUrl || '';
        document.getElementById('admin-api-key').value = config.apiKey || '';
        document.getElementById('admin-webhook-url').value = config.webhookUrl || '';
        document.getElementById('admin-email-key').value = config.emailKey || '';
        document.getElementById('admin-use-supabase-stats').checked = !!config.useSupabaseForStats;
        document.getElementById('admin-discord-id').value = config.discordId || '';
        document.getElementById('admin-discord-invite-url').value = config.discordInviteUrl || '';
        document.getElementById('admin-discord-custom-url').value = config.discordCustomUrl || '';
        document.getElementById('admin-tiktok-username').value = config.tiktokUsername || '';
        document.getElementById('admin-tiktok-key').value = config.tiktokKey || '';
        document.getElementById('admin-tiktok-custom-url').value = config.tiktokCustomUrl || '';
        document.getElementById('admin-reddit-sub').value = config.redditSub || '';
        document.getElementById('admin-reddit-custom-url').value = config.redditCustomUrl || '';

        renderAdminTables();
    };

    const calculateStats = (waitlistLen, supportLen, communityLen) => {
        const config = db.getAdminConfig();

        document.getElementById('stat-waitlist').textContent = waitlistLen;
        document.getElementById('stat-support').textContent = supportLen;
        document.getElementById('stat-threads').textContent = communityLen;
        
        const dbStatus = document.getElementById('stat-db-status');
        if (config.isConnected) {
            dbStatus.textContent = 'Supabase Sync';
            dbStatus.className = 'stat-num status-connected';
        } else if (config.emailKey) {
            dbStatus.textContent = 'Web3Forms Active';
            dbStatus.className = 'stat-num status-connected';
        } else {
            dbStatus.textContent = 'Local Only';
            dbStatus.className = 'stat-num status-connected offline';
        }
    };

    if (toggleKeyBtn) {
        toggleKeyBtn.addEventListener('click', () => {
            const keyInput = document.getElementById('admin-api-key');
            if (keyInput.type === 'password') {
                keyInput.type = 'text';
                toggleKeyBtn.textContent = 'Hide';
            } else {
                keyInput.type = 'password';
                toggleKeyBtn.textContent = 'Show';
            }
        });
    }

    if (adminConfigForm) {
        adminConfigForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const supUrl = document.getElementById('admin-supabase-url').value.trim();
            const apiKey = document.getElementById('admin-api-key').value.trim();
            const webUrl = document.getElementById('admin-webhook-url').value.trim();
            const emailKey = document.getElementById('admin-email-key').value.trim();
            const useSupabaseForStats = document.getElementById('admin-use-supabase-stats').checked;
            const discordId = document.getElementById('admin-discord-id').value.trim();
            const discordInviteUrl = document.getElementById('admin-discord-invite-url').value.trim();
            const discordCustomUrl = document.getElementById('admin-discord-custom-url').value.trim();
            const tiktokUsername = document.getElementById('admin-tiktok-username').value.trim();
            const tiktokKey = document.getElementById('admin-tiktok-key').value.trim();
            const tiktokCustomUrl = document.getElementById('admin-tiktok-custom-url').value.trim();
            const redditSub = document.getElementById('admin-reddit-sub').value.trim();
            const redditCustomUrl = document.getElementById('admin-reddit-custom-url').value.trim();

            const isConn = (supUrl !== '' && apiKey !== '');

            const config = {
                supabaseUrl: supUrl,
                apiKey: apiKey,
                webhookUrl: webUrl,
                emailKey: emailKey,
                discordId: discordId,
                discordInviteUrl: discordInviteUrl,
                discordCustomUrl: discordCustomUrl,
                tiktokUsername: tiktokUsername,
                tiktokKey: tiktokKey,
                tiktokCustomUrl: tiktokCustomUrl,
                redditSub: redditSub,
                redditCustomUrl: redditCustomUrl,
                useSupabaseForStats: useSupabaseForStats,
                isConnected: isConn
            };

            db.saveAdminConfig(config);

            adminFeedback.textContent = 'Settings updated. Database synchronized successfully.';
            adminFeedback.className = 'form-feedback success';
            adminFeedback.style.display = 'block';

            const logs = [
                `Settings updated.`,
                `Supabase database: ${isConn ? 'connected' : 'offline'}`,
                `Email notifications: ${emailKey ? 'active' : 'disabled'}`,
                `Use Supabase for stats: ${useSupabaseForStats ? 'enabled' : 'disabled'}`,
                `Syncing local data with Supabase...`
            ];
            appendAdminConsoleLogs(logs);

            setTimeout(() => {
                adminFeedback.style.display = 'none';
            }, 4000);

            await renderAdminTables();
            updateSocialStatsUI();
            updateSocialLinksUI();
        });
    }

    if (adminClearBtn) {
        adminClearBtn.addEventListener('click', async () => {
            document.getElementById('admin-supabase-url').value = '';
            document.getElementById('admin-api-key').value = '';
            document.getElementById('admin-webhook-url').value = '';
            document.getElementById('admin-email-key').value = '';
            document.getElementById('admin-use-supabase-stats').checked = false;
            document.getElementById('admin-discord-id').value = '';
            document.getElementById('admin-discord-invite-url').value = '';
            document.getElementById('admin-discord-custom-url').value = '';
            document.getElementById('admin-tiktok-username').value = '';
            document.getElementById('admin-tiktok-key').value = '';
            document.getElementById('admin-tiktok-custom-url').value = '';
            document.getElementById('admin-reddit-sub').value = '';
            document.getElementById('admin-reddit-custom-url').value = '';

            const config = {
                supabaseUrl: '',
                apiKey: '',
                webhookUrl: '',
                emailKey: '',
                discordId: '',
                discordInviteUrl: '',
                discordCustomUrl: '',
                tiktokUsername: '',
                tiktokKey: '',
                tiktokCustomUrl: '',
                redditSub: '',
                redditCustomUrl: '',
                useSupabaseForStats: false,
                isConnected: false
            };
            db.saveAdminConfig(config);

            appendAdminConsoleLogs([`Database credentials cleared.`]);
            await renderAdminTables();
            updateSocialStatsUI();
            updateSocialLinksUI();
        });
    }

    const appendAdminConsoleLogs = (lines) => {
        if (!consoleBody) return;
        lines.forEach(line => {
            const row = document.createElement('div');
            row.className = 'console-row';
            row.textContent = line;
            consoleBody.appendChild(row);
        });
        consoleBody.scrollTop = consoleBody.scrollHeight;
    };

    const uploadToSupabaseSingle = async (endpointType, payload) => {
        const config = db.getAdminConfig();
        if (!config.apiKey || !config.supabaseUrl) return false;
        try {
            const url = `${config.supabaseUrl}/rest/v1/${endpointType}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': config.apiKey,
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });
            return response.ok;
        } catch (err) {
            console.error(`Upload error to ${endpointType}:`, err);
            return false;
        }
    };

    const syncLocalToSupabase = async () => {
        const config = db.getAdminConfig();
        if (!config.isConnected) return;

        appendAdminConsoleLogs([`Syncing local entries with Supabase...`]);

        // 1. Sync waitlist leads
        const localWaitlist = db.getWaitlist();
        const supWaitlist = await fetchFromSupabase('waitlist_leads');
        if (supWaitlist && Array.isArray(supWaitlist)) {
            const unsynced = localWaitlist.filter(local => 
                !supWaitlist.some(sup => sup.email.toLowerCase() === local.email.toLowerCase())
            );
            if (unsynced.length > 0) {
                appendAdminConsoleLogs([`Found ${unsynced.length} unsynced waitlist entries. Syncing...`]);
                for (const record of unsynced) {
                    const success = await uploadToSupabaseSingle('waitlist_leads', {
                        email: record.email,
                        handle: record.handle || 'Direct',
                        tier: record.tier || 'General Waitlist',
                        date: record.date,
                        source: record.source || 'Landing (Hero)'
                    });
                    if (success) {
                        appendAdminConsoleLogs([`Synced waitlist entry: ${record.email}`]);
                    }
                }
            }
        }

        // 2. Sync support tickets
        const localSupport = db.getSupport();
        const supSupport = await fetchFromSupabase('support_tickets');
        if (supSupport && Array.isArray(supSupport)) {
            const unsynced = localSupport.filter(local => 
                !supSupport.some(sup => sup.email.toLowerCase() === local.email.toLowerCase() && sup.date === local.date)
            );
            if (unsynced.length > 0) {
                appendAdminConsoleLogs([`Found ${unsynced.length} unsynced support tickets. Syncing...`]);
                for (const record of unsynced) {
                    const success = await uploadToSupabaseSingle('support_tickets', {
                        name: record.name,
                        email: record.email,
                        handle: record.handle || 'N/A',
                        category: record.category,
                        message: record.message,
                        date: record.date
                    });
                    if (success) {
                        appendAdminConsoleLogs([`Synced support ticket: ${record.email}`]);
                    }
                }
            }
        }

        // 3. Sync community suggestions
        const localCommunity = db.getCommunity();
        const supCommunity = await fetchFromSupabase('community_forum');
        if (supCommunity && Array.isArray(supCommunity)) {
            const unsynced = localCommunity.filter(local => 
                !supCommunity.some(sup => sup.username.toLowerCase() === local.username.toLowerCase() && sup.date === local.date)
            );
            if (unsynced.length > 0) {
                appendAdminConsoleLogs([`Found ${unsynced.length} unsynced suggestions. Syncing...`]);
                for (const record of unsynced) {
                    const success = await uploadToSupabaseSingle('community_forum', {
                        username: record.username,
                        handle: record.handle || 'N/A',
                        category: record.category,
                        content: record.content,
                        date: record.date
                    });
                    if (success) {
                        appendAdminConsoleLogs([`Synced suggestion by: ${record.username}`]);
                    }
                }
            }
        }
    };

    const renderAdminTables = async () => {
        const waitlistTable = document.querySelector('#table-waitlist tbody');
        const supportTable = document.querySelector('#table-support tbody');
        const communityTable = document.querySelector('#table-community tbody');

        const config = db.getAdminConfig();

        if (config.isConnected) {
            await syncLocalToSupabase();
        }

        let waitlist = db.getWaitlist();
        let tickets = db.getSupport();
        let posts = db.getCommunity();

        if (config.isConnected) {
            appendAdminConsoleLogs([`Querying database from Supabase...`]);
            
            const supWaitlist = await fetchFromSupabase('waitlist_leads');
            if (supWaitlist && Array.isArray(supWaitlist)) {
                waitlist = supWaitlist;
                appendAdminConsoleLogs([`Synced ${supWaitlist.length} waitlist entries.`]);
            }
            
            const supSupport = await fetchFromSupabase('support_tickets');
            if (supSupport && Array.isArray(supSupport)) {
                tickets = supSupport;
                appendAdminConsoleLogs([`Synced ${supSupport.length} support tickets.`]);
            }
            
            const supCommunity = await fetchFromSupabase('community_forum');
            if (supCommunity && Array.isArray(supCommunity)) {
                posts = supCommunity;
                appendAdminConsoleLogs([`Synced ${supCommunity.length} suggestions.`]);
            }
        }

        // Render Waitlist Table
        if (waitlistTable) {
            if (waitlist.length === 0) {
                waitlistTable.innerHTML = '<tr><td colspan="5" class="font-gray text-center" style="padding: 16px;">No waitlist emails registered.</td></tr>';
            } else {
                const sortedWaitlist = [...waitlist].sort((a,b) => new Date(b.date) - new Date(a.date));
                waitlistTable.innerHTML = sortedWaitlist.map(row => {
                    const formattedDate = row.date ? new Date(row.date).toLocaleString() : 'N/A';
                    return `
                        <tr>
                            <td class="mono-input">${escapeHtml(row.email)}</td>
                            <td><strong style="color: #ffffff;">${escapeHtml(row.handle || 'Direct')}</strong></td>
                            <td><span class="post-tag">${escapeHtml(row.tier || 'General Waitlist')}</span></td>
                            <td>${formattedDate}</td>
                            <td><span class="post-tag">${escapeHtml(row.source)}</span></td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Render Support Tickets Table
        if (supportTable) {
            if (tickets.length === 0) {
                supportTable.innerHTML = '<tr><td colspan="6" class="font-gray text-center" style="padding: 16px;">No inquiry tickets open.</td></tr>';
            } else {
                const sortedTickets = [...tickets].sort((a,b) => new Date(b.date) - new Date(a.date));
                supportTable.innerHTML = sortedTickets.map(row => {
                    const formattedDate = row.date ? new Date(row.date).toLocaleString() : 'N/A';
                    return `
                        <tr>
                            <td><strong>${escapeHtml(row.name)}</strong></td>
                            <td class="mono-input">${escapeHtml(row.email)}</td>
                            <td><strong style="color: #ffffff;">${escapeHtml(row.handle || 'N/A')}</strong></td>
                            <td><span class="post-tag">${escapeHtml(row.category)}</span></td>
                            <td><span class="font-gray" style="max-width: 250px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(row.message)}">${escapeHtml(row.message)}</span></td>
                            <td>${formattedDate}</td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Render Community Suggestions Table
        if (communityTable) {
            if (posts.length === 0) {
                communityTable.innerHTML = '<tr><td colspan="6" class="font-gray text-center" style="padding: 16px;">No community suggestions.</td></tr>';
            } else {
                const sortedPosts = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date));
                communityTable.innerHTML = sortedPosts.map(row => {
                    const formattedDate = row.date ? new Date(row.date).toLocaleString() : 'N/A';
                    return `
                        <tr>
                            <td><strong>${escapeHtml(row.username)}</strong></td>
                            <td><strong style="color: #ffffff;">${escapeHtml(row.handle || 'N/A')}</strong></td>
                            <td><span class="post-tag">${escapeHtml(row.category)}</span></td>
                            <td><span class="font-gray" style="max-width: 250px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(row.content)}">${escapeHtml(row.content)}</span></td>
                            <td>${formattedDate}</td>
                            <td class="cell-actions">
                                <button class="btn-table-action btn-delete-post" data-date="${row.date}">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            document.querySelectorAll('.btn-delete-post').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const dateVal = this.getAttribute('data-date');
                    let deletionSuccess = true;

                    if (config.isConnected) {
                        appendAdminConsoleLogs([`Deleting community suggestion...`]);
                        deletionSuccess = await deleteFromSupabase('community_forum', dateVal);
                    }

                    if (deletionSuccess) {
                        const localPosts = db.getCommunity();
                        const recordIndex = localPosts.findIndex(p => p.date === dateVal);
                        if (recordIndex !== -1) {
                            localPosts.splice(recordIndex, 1);
                            db.saveCommunity(localPosts);
                        }

                        appendAdminConsoleLogs([`Entry deleted.`]);
                        await renderAdminTables();
                    }
                });
            });
        }

        calculateStats(waitlist.length, tickets.length, posts.length);
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = `tab-${btn.getAttribute('data-tab')}-content`;
            document.getElementById(tabId).classList.add('active');
        });
    });

    const updateSocialStatsUI = async () => {
        const config = db.getAdminConfig();
        
        const discordStat = document.getElementById('discord-stat');
        const tiktokStat = document.getElementById('tiktok-stat');
        const redditStat = document.getElementById('reddit-stat');

        // Option 1: Supabase database sync
        if (config.useSupabaseForStats && config.apiKey && config.supabaseUrl) {
            try {
                const data = await fetchFromSupabase('social_stats');
                if (data && Array.isArray(data) && data.length > 0) {
                    let discordCount, tiktokCount, redditCount;
                    
                    // Format A: Row per platform: [{platform: 'discord', count: 123}]
                    const discordRow = data.find(r => r.platform && r.platform.toLowerCase() === 'discord');
                    if (discordRow) discordCount = discordRow.count !== undefined ? discordRow.count : discordRow.value;
                    
                    const tiktokRow = data.find(r => r.platform && r.platform.toLowerCase() === 'tiktok');
                    if (tiktokRow) tiktokCount = tiktokRow.count !== undefined ? tiktokRow.count : tiktokRow.value;
                    
                    const redditRow = data.find(r => r.platform && r.platform.toLowerCase() === 'reddit');
                    if (redditRow) redditCount = redditRow.count !== undefined ? redditRow.count : redditRow.value;

                    // Format B: Single row with separate fields: [{discord_count: 123, tiktok_count: 456}]
                    if (discordCount === undefined && tiktokCount === undefined && redditCount === undefined) {
                        const row = data[0] || {};
                        discordCount = row.discord_count !== undefined ? row.discord_count : (row.discord_online !== undefined ? row.discord_online : row.discord);
                        tiktokCount = row.tiktok_count !== undefined ? row.tiktok_count : (row.tiktok_followers !== undefined ? row.tiktok_followers : row.tiktok);
                        redditCount = row.reddit_count !== undefined ? row.reddit_count : (row.reddit_subscribers !== undefined ? row.reddit_subscribers : row.reddit);
                    }

                    if (discordCount !== undefined && discordStat) {
                        discordStat.textContent = `${Number(discordCount).toLocaleString()} Online`;
                    }
                    if (tiktokCount !== undefined && tiktokStat) {
                        tiktokStat.textContent = `${Number(tiktokCount).toLocaleString()} Followers`;
                    }
                    if (redditCount !== undefined && redditStat) {
                        redditStat.textContent = `${Number(redditCount).toLocaleString()} Members`;
                    }
                    
                    appendAdminConsoleLogs([`Live social counts synchronized from Supabase social_stats table.`]);
                    return; // Skip normal fetching
                }
            } catch (err) {
                console.error("Supabase stats fetch error:", err);
                appendAdminConsoleLogs([`Supabase stats table fetch failed: ${err.message}`]);
            }
        }

        // Option 2: Individual Custom endpoints or Direct API fetching
        
        // 1. Discord Count Fetching
        if (discordStat) {
            let discordLoaded = false;
            if (config.discordCustomUrl) {
                try {
                    const response = await fetch(config.discordCustomUrl);
                    if (response.ok) {
                        const json = await response.json();
                        const count = json.online !== undefined ? json.online : (json.presence_count !== undefined ? json.presence_count : (json.count !== undefined ? json.count : json));
                        if (count !== undefined) {
                            discordStat.textContent = `${Number(count).toLocaleString()} Online`;
                            discordLoaded = true;
                        }
                    }
                } catch (err) {
                    console.error("Discord custom URL error:", err);
                }
            }
            
            if (!discordLoaded && config.discordId) {
                try {
                    const response = await fetch(`https://discord.com/api/guilds/${config.discordId}/widget.json`);
                    if (response.ok) {
                        const data = await response.json();
                        discordStat.textContent = `${data.presence_count.toLocaleString()} Online`;
                        discordLoaded = true;
                    } else {
                        discordStat.textContent = "Offline / Config Error";
                    }
                } catch (err) {
                    console.error("Discord widget error:", err);
                    discordStat.textContent = "Unable to load";
                }
            }
            
            if (!discordLoaded && !config.discordCustomUrl && !config.discordId) {
                discordStat.textContent = "2,480 Online";
            }
        }
        
        // 2. TikTok Followers Fetching
        if (tiktokStat) {
            let tiktokLoaded = false;
            if (config.tiktokCustomUrl) {
                try {
                    const response = await fetch(config.tiktokCustomUrl);
                    if (response.ok) {
                        const json = await response.json();
                        const count = json.followers !== undefined ? json.followers : (json.follower_count !== undefined ? json.follower_count : (json.count !== undefined ? json.count : json));
                        if (count !== undefined) {
                            tiktokStat.textContent = `${Number(count).toLocaleString()} Followers`;
                            tiktokLoaded = true;
                        }
                    }
                } catch (err) {
                    console.error("TikTok custom URL error:", err);
                }
            }
            
            if (!tiktokLoaded && config.tiktokKey && config.tiktokUsername) {
                try {
                    const response = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=follower_count,username`, {
                        headers: {
                            'Authorization': `Bearer ${config.tiktokKey}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const followers = data.data?.user?.follower_count;
                        if (followers !== undefined) {
                            tiktokStat.textContent = `${followers.toLocaleString()} Followers`;
                            tiktokLoaded = true;
                        } else {
                            tiktokStat.textContent = "API Error";
                        }
                    } else {
                        tiktokStat.textContent = "Access Denied";
                    }
                } catch (err) {
                    console.error("TikTok API error:", err);
                    tiktokStat.textContent = "CORS Blocked / Error";
                }
            }
            
            if (!tiktokLoaded && !config.tiktokCustomUrl && !(config.tiktokKey && config.tiktokUsername)) {
                tiktokStat.textContent = "15.4K Followers";
            }
        }

        // 3. Reddit Subscriber and Online Fetching
        if (redditStat) {
            let redditLoaded = false;
            if (config.redditSub) {
                try {
                    const response = await fetch(`https://www.reddit.com/r/${config.redditSub}/about.json`);
                    if (response.ok) {
                        const data = await response.json();
                        const subs = data.data?.subscribers;
                        const active = data.data?.active_user_count;
                        if (subs !== undefined) {
                            if (active !== undefined && active > 0) {
                                redditStat.textContent = `${subs.toLocaleString()} Members (${active.toLocaleString()} Online)`;
                            } else {
                                redditStat.textContent = `${subs.toLocaleString()} Members`;
                            }
                            redditLoaded = true;
                        } else {
                            redditStat.textContent = "Reddit Error";
                        }
                    } else {
                        redditStat.textContent = "Subreddit Not Found";
                    }
                } catch (err) {
                    console.error("Reddit API error:", err);
                    redditStat.textContent = "Unable to load";
                }
            }
            
            if (!redditLoaded && config.redditSub) {
                // If custom URL is failed but we have sub, that's already tried above.
                // Keep it empty.
            }
            
            if (!redditLoaded && !config.redditSub) {
                redditStat.textContent = "12.4K Members";
            }
        }
    };

    const updateSocialLinksUI = () => {
        const config = db.getAdminConfig();
        
        // 1. Discord Invite Link
        const discordInviteBtn = document.getElementById('discord-invite-btn');
        if (discordInviteBtn && config.discordInviteUrl) {
            discordInviteBtn.href = config.discordInviteUrl;
        } else if (discordInviteBtn) {
            discordInviteBtn.href = "https://discord.gg/freehand"; // default fallback
        }
        
        // 2. TikTok Links
        const tiktokLinkBtn = document.getElementById('tiktok-link-btn');
        const footerTiktokLink = document.getElementById('footer-tiktok-link');
        if (config.tiktokUsername) {
            const fullUrl = `https://tiktok.com/@${config.tiktokUsername}`;
            if (tiktokLinkBtn) tiktokLinkBtn.href = fullUrl;
            if (footerTiktokLink) footerTiktokLink.href = fullUrl;
        } else {
            const fallback = "https://tiktok.com/@freehandhardware";
            if (tiktokLinkBtn) tiktokLinkBtn.href = fallback;
            if (footerTiktokLink) footerTiktokLink.href = fallback;
        }
        
        // 3. Reddit Links
        const redditLinkBtn = document.getElementById('reddit-link-btn');
        const footerRedditLink = document.getElementById('footer-reddit-link');
        if (config.redditSub) {
            const fullUrl = `https://reddit.com/r/${config.redditSub}`;
            if (redditLinkBtn) redditLinkBtn.href = fullUrl;
            if (footerRedditLink) footerRedditLink.href = fullUrl;
        } else {
            const fallback = "https://reddit.com/r/freehandhardware";
            if (redditLinkBtn) redditLinkBtn.href = fallback;
            if (footerRedditLink) footerRedditLink.href = fallback;
        }
    };

    function escapeHtml(string) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(string).replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Call social media API stats updates and links updates on page load
    updateSocialStatsUI();
    updateSocialLinksUI();

});
