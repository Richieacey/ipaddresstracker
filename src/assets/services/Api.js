export async function getDefaultIPInfo(query) {
    try {
        const response = await fetch(`https://ipinfo.io/${query}`);

        // Check for non-200 responses (e.g., rate limits, invalid query)
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();

        console.log("IP Info API Response Data:", data);
        
        const { ip: Ipaddr, city, country, postal, loc: coordinates, timezone, org: isp } = data;

        const Info = {
            Ipaddr,
            city,
            country,
            postal,
            coordinates,
            timezone,
            isp
        };

        return Info;

    } catch (error) {
        console.error("Error fetching IP information:", error);
        return null; 
    }
}