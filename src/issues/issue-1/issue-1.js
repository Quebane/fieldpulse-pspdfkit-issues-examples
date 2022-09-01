import {useEffect, useRef, useState} from "react";

export default function Issue1(props) {
    const containerRef = useRef(null);
    const [instance, setInstance] = useState();

    useEffect(() => {
        const container = containerRef.current;
        let instance, PSPDFKit;
        (async function () {
            PSPDFKit = await import("pspdfkit");
            instance = await PSPDFKit.load({
                // Container where PSPDFKit should be mounted.
                container,
                // The document to open.
                document: 'https://cdn.fieldpulse.com/pspdfkit/empty-pdf.pdf',
                // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
                baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
                toolbarItems: [
                    ...PSPDFKit.defaultToolbarItems,
                    {
                        type: "form-creator"
                    }
                ],
                formDesignMode: true,
                showToolbar: true,
                enableAnnotationToolbar: false,
                enableClipboardActions: true
            });
            setInstance(instance);
        })();

        return () => PSPDFKit && PSPDFKit.unload(container);
    }, []);

    const downloadPDF = () => {
        instance.exportPDF().then((buffer) => {
            const blob = new Blob([buffer], {type: 'application/pdf'});
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.style.display = 'none';
            a.download = 'test.pdf';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(objectUrl);
            document.body.removeChild(a);
        });
    }

    return (
        <div>
            <div>
                <button onClick={downloadPDF} type='button'>Download</button>
            </div>
            <div ref={containerRef} style={{width: "100%", height: "100vh"}}/>
        </div>
    );
}
