export const Footer = () => {
    return (
        <footer className="flex border=t justify-between font-medium p-6">
            <div>
                <p>
                   Dunzo inc
                </p>
                <p>
                    &copy; {new Date().getFullYear()} Your Company. All rights reserved.

                </p>

            </div>
        </footer>
    )
}