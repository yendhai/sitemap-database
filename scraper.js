const axios = require('axios');
const fs = require('fs');

// Mengambil data langsung dari Feed JSON Blogger (maksimal 500 artikel sekaligus)
const FEED_URL = 'https://katakanji.blogspot.com/feeds/posts/default?alt=json&max-results=500';

async function fetchBloggerData() {
    try {
        console.log('Mengambil data artikel dari Blogger Feed...');
        const response = await axios.get(FEED_URL);
        
        // Memastikan ada data artikel yang terdeteksi
        const entries = response.data.feed.entry || [];
        console.log(`Ditemukan ${entries.length} artikel. Menyusun database...`);
        
        let postsData = [];

        entries.forEach((entry) => {
            // Mencari tautan asli postingan
            const linkObj = entry.link.find(l => l.rel === 'alternate');
            const url = linkObj ? linkObj.href : null;
            
            // Mengambil judul asli
            const title = entry.title.$t;

            if (url && title) {
                postsData.push({
                    url: url,
                    judul_asli: title
                });
            }
        });

        // Menyimpan hasil ke posts.json
        fs.writeFileSync('posts.json', JSON.stringify(postsData, null, 2));
        console.log(`Proses selesai. File posts.json sukses diperbarui dengan ${postsData.length} artikel.`);

    } catch (error) {
        console.error('Terjadi kesalahan saat memproses data:', error.message);
    }
}

fetchBloggerData();
