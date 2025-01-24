import bgVideo from "../assets/estatevideoBG.mp4";

const Home = () => {
  return (
    <div className="relative h-screen w-full">
        <video 
            className="absolute top-0 left-0 w-full h-full object-cover blur-md" 
            src={bgVideo}
            autoPlay 
            loop 
            muted>
        </video>

        {/* Overlay Content */}
        <div className="relative flex items-center justify-center h-full bg-black bg-opacity-50 text-white">
            <h1 className="text-4xl font-bold">Welcome to SkyHomes Estate</h1>
        </div>
    </div>
  )
}

export default Home
