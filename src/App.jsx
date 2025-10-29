import { useEffect, useState, useMemo } from "react"
import { getDefaultIPInfo } from "./assets/services/Api"
import SimpleMap from './assets/components/MapComponent';

const INFO_BOX_ITEM_STYLE = "flex flex-col justify-center items-center p-3 md:p-0";
const INFO_BOX_LABEL_STYLE = "text-gray-500 text-xs font-bold uppercase tracking-widest mb-1";
const INFO_BOX_VALUE_STYLE = "font-bold text-xl md:text-2xl text-gray-900";


export function IpInfoDisplay({ ipData, isOpen, isLoading }) {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center z-10 absolute top-[17rem] gap-5 py-6 w-[80vw] bg-white rounded-xl shadow-xl">
        <span className="text-lg font-semibold">Loading IP details...</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col md:flex-row items-center justify-center z-10 absolute top-[17rem] py-6 w-[80vw] bg-white rounded-xl shadow-xl transition-all duration-300 origin-top transform 
                    ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}>

      {/* IP ADDRESS */}
      <div className={`${INFO_BOX_ITEM_STYLE} md:border-r md:w-1/4`}>
        <span className={INFO_BOX_LABEL_STYLE}>IP ADDRESS</span>
        <span className={INFO_BOX_VALUE_STYLE}>{ipData.Ipaddr || 'N/A'}</span>
      </div>

      {/* LOCATION */}
      <div className={`${INFO_BOX_ITEM_STYLE} md:border-r md:w-1/4`}>
        <span className={INFO_BOX_LABEL_STYLE}>LOCATION</span>
        <span className={INFO_BOX_VALUE_STYLE}>{`${ipData.city || 'N/A'}, ${ipData.country || 'N/A'}, ${ipData.postal || ''}`}</span>
      </div>

      {/* TIMEZONE */}
      <div className={`${INFO_BOX_ITEM_STYLE} md:border-r md:w-1/4`}>
        <span className={INFO_BOX_LABEL_STYLE}>TIMEZONE</span>
        <span className={INFO_BOX_VALUE_STYLE}>{ipData.timezone || 'N/A'}</span>
      </div>

      {/* ISP */}
      <div className={`${INFO_BOX_ITEM_STYLE} md:w-1/4`}>
        <span className={INFO_BOX_LABEL_STYLE}>ISP</span>
        <span className={INFO_BOX_VALUE_STYLE}>{ipData.isp || 'N/A'}</span>
      </div>
    </div>
  )
}


export default function App() {
 
  const [ipData, setIpData] = useState({
    Ipaddr: null,
    city: null,
    country: null,
    postal: null,
    coordinates: null,
    timezone: null,
    isp: null
  });

  const [isLoading, setIsLoading] = useState(true); 
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, SetSearchQuery] = useState("");

  const processAndSetData = (info) => {
    if (!info) {
      console.error("Could not fetch IP data.");
  
      setIsOpen(false);
      return;
    }

    setIpData({
      Ipaddr: info.Ipaddr,
      city: info.city,
      country: info.country,
      postal: info.postal,
      coordinates: info.coordinates,
      timezone: info.timezone,
      isp: info.isp
    });
    setIsOpen(true);
  };

  const [deviceLatitude, deviceLongitude] = useMemo(() => {
    if (!ipData.coordinates) return [0, 0];

    const [latStr, longStr] = ipData.coordinates.split(',');

    const lat = parseFloat(latStr.trim());
    const long = parseFloat(longStr.trim());

    return [!isNaN(lat) ? lat : 0, !isNaN(long) ? long : 0];
  }, [ipData.coordinates]);


  useEffect(() => {
    const CurrentLocationData = async () => {
      setIsLoading(true);
      const info = await getDefaultIPInfo('json');
      processAndSetData(info);
      setIsLoading(false); 
    }

    CurrentLocationData();
  }, []);



  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const SearchLocationData = async () => {
      setIsLoading(true); 
      const info = await getDefaultIPInfo(`${searchQuery}/json`);
      processAndSetData(info);
      setIsLoading(false); 
    }

    SearchLocationData();
  }


  return (
    <>
      <header className="flex items-center justify-center flex-col relative w-full">
        <img src="https://m4xfwg1vaot0d1nn.public.blob.vercel-storage.com/pattern-bg-mobile.png" className="w-full absolute z-[2] block md:hidden top-0 h-[20rem] object-cover" alt="background" />
        <img src="https://m4xfwg1vaot0d1nn.public.blob.vercel-storage.com/pattern-bg-desktop.png" className="w-full absolute z-[2] md:block hidden top-0 h-[20rem] object-cover" alt="background" />

        <div className="flex flex-col justify-center items-center top-10 relative z-20 w-full pt-8">
          <h1 className="text-3xl text-white mb-8 font-bold">IP Address Tracker</h1>
          <form onSubmit={handleSearch} className="flex flex-row items-center relative w-[80vw] md:w-auto">
            <input
              value={searchQuery}
              onChange={(e) => SetSearchQuery(e.target.value)}
              type="text"
              placeholder="Search for any IP address or domain"
              className="px-4 h-[4rem] md:w-[500px] w-full rounded-l-xl text-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black hover:bg-gray-700 transition-colors px-6 h-[4rem] rounded-r-xl flex items-center justify-center"
              aria-label="Search"
            >
              <img src="https://m4xfwg1vaot0d1nn.public.blob.vercel-storage.com/icon-arrow.svg" alt="Arrow icon" />
            </button>
          </form>
        </div>


        <IpInfoDisplay
          ipData={ipData}
          isOpen={isOpen}
          isLoading={isLoading}
        />
      </header>

      <SimpleMap
        latitude={deviceLatitude}
        longitude={deviceLongitude}
        popupText={ipData.Ipaddr}
      />
    </>
  )
}