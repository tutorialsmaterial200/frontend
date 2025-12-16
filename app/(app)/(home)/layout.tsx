import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchInput } from "./search-filter";
import Categories from './categories';

interface Props {
    children: React.ReactNode;
}

const layout = ({ children }: Props) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <SearchInput />

            <Categories />
            <div className="flex-1 bg-[#F4F4F0]">
                {children}
            </div>
            <Footer />
        </div>
    )
}
export default layout;