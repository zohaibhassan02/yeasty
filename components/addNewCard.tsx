import Link from "next/link";

export default function AddNewCard() {
  return (
    <div className="aspect-[1.41] mx-auto shrink-0 rounded-[20px] bg-gradient-to-br from-[#01B7C5] to-[#782C96] bg-gradient p-[1px]" style={{ boxShadow: "0 10px 15px #0003", width: '355px', height: '250px', flexShrink: 0 }}>
      <Link href="/edit">
        <div className="relative h-full rounded-[20px]" style={{ background: `center / cover url(/images/cardbg3.png)` }}>
          <img src="/images/overlay.svg" alt="overlay" width="100%" className="absolute bottom-0 rounded-b-[20px] left-0" />
          <div className="absolute top-[32%] left-0 right-0 bottom-0 cursor-pointer">
            <p className="text-[28px] leading-[28px] h-[28px] text-center font-bold text-white mb-3">+</p>
            <p className="px-4 text-[20px] leading-[20px] text-white font-semibold mb-2 text-center">Add New Draft</p>
            <p className="px-4 text-[13px] leading-[13px] text-[#ffffff8b] text-center">Search for new draft to add</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
