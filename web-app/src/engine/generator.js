import * as core from './docx_core.js';

export function generateVbCoTenLoai(data) {
    const children = [];

    // 1. Header: CQ ban hành + ĐẢNG CỘNG SẢN VIỆT NAM
    children.push(core.createHeader(data));

    // 2. Số ký hiệu + Ngày tháng
    children.push(core.createSoKyHieu(data));

    // 3. Tên loại VB + Trích yếu + gạch ngang
    const tenLoaiElements = core.createTenLoai(data);
    children.push(...tenLoaiElements);

    // 3b. Kính gửi (chỉ cho Tờ trình)
    if (data.loai_van_ban === 'to_trinh') {
        const kinhGuiElements = core.createKinhGui(data);
        children.push(...kinhGuiElements);
    }

    // 4. Nội dung VB
    const bodyElements = core.createBody(data);
    children.push(...bodyElements);

    // 5. Chữ ký + Nơi nhận
    children.push(
        new core.Paragraph({ spacing: { before: 240, after: 0 }, children: [] })
    );
    children.push(core.createSignatureBlock(data));

    return core.createDocument(children);
}

export function generateCongVan(data) {
    const children = [];

    // 1. Header
    children.push(core.createHeader(data));

    // 2. Số ký hiệu + Ngày tháng
    children.push(core.createSoKyHieu(data));

    // 3. Kính gửi (Công văn bắt buộc có)
    const kinhGuiElements = core.createKinhGui(data);
    children.push(...kinhGuiElements);

    // 4. Nội dung VB
    const bodyElements = core.createBody(data);
    children.push(...bodyElements);

    // 5. Chữ ký + Nơi nhận
    children.push(
        new core.Paragraph({ spacing: { before: 240, after: 0 }, children: [] })
    );
    children.push(core.createSignatureBlock(data));

    return core.createDocument(children);
}

export function generateBienBan(data) {
    const children = [];

    // 1. Header
    children.push(core.createHeader(data));
    children.push(core.createSoKyHieu(data));

    // 2. Tên loại: BIÊN BẢN (KHÔNG có gạch nối ngang phía dưới đối với biên bản thông thường)
    children.push(
        new core.Paragraph({
            alignment: core.AlignmentType.CENTER,
            spacing: { before: 360, after: 0 },
            children: [
                new core.TextRun({
                    text: 'BIÊN BẢN',
                    font: core.LAYOUT.FONT, size: 32, bold: true, // cỡ 16, đậm
                }),
            ],
        })
    );

    // 3. Trích yếu
    if (data.trich_yeu) {
        children.push(
            new core.Paragraph({
                alignment: core.AlignmentType.CENTER,
                spacing: { before: 60, after: 240 },
                children: [
                    new core.TextRun({
                        text: data.trich_yeu,
                        font: core.LAYOUT.FONT, size: 28, bold: true, // cỡ 14, đậm
                    }),
                ],
            })
        );
    }

    // 4. Nội dung phần trên
    const dsText = data.noi_dung || '';
    const bodyLines = dsText.split('\n').filter(l => l.trim() !== '');

    bodyLines.forEach((line) => {
        children.push(
            new core.Paragraph({
                alignment: core.AlignmentType.JUSTIFIED,
                spacing: core.BODY_SPACING,
                indent: { firstLine: 567 },
                children: [
                    new core.TextRun({
                        text: line.trim(),
                        font: core.LAYOUT.FONT, size: 28,
                    }),
                ],
            })
        );
    });

    // 5. Khối 2 chữ ký ngang nhau: Người ghi - Chủ trì
    children.push(
        new core.Paragraph({ spacing: { before: 120, after: 0 }, children: [] })
    );

    children.push(
        new core.Table({
            width: { size: core.LAYOUT.CONTENT_WIDTH, type: core.WidthType.DXA },
            borders: core.BORDERS_NONE,
            columnWidths: [4677, 4678],
            rows: [
                new core.TableRow({
                    children: [
                        new core.TableCell({
                            borders: core.BORDERS_NONE,
                            width: { size: 4677, type: core.WidthType.DXA },
                            verticalAlign: core.VerticalAlign.TOP,
                            children: [
                                new core.Paragraph({
                                    alignment: core.AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        new core.TextRun({
                                            text: data.chuc_vu_trai || 'NGƯỜI GHI BIÊN BẢN',
                                            font: core.LAYOUT.FONT, size: 28, bold: true,
                                        }),
                                    ],
                                }),
                                ...Array(4).fill(
                                    new core.Paragraph({
                                        spacing: { before: 0, after: 0 },
                                        children: [new core.TextRun({ text: '', size: 28 })],
                                    })
                                ),
                                new core.Paragraph({
                                    alignment: core.AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        new core.TextRun({
                                            text: data.nguoi_ghi || '',
                                            font: core.LAYOUT.FONT, size: 28, bold: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                        new core.TableCell({
                            borders: core.BORDERS_NONE,
                            width: { size: 4678, type: core.WidthType.DXA },
                            verticalAlign: core.VerticalAlign.TOP,
                            children: [
                                new core.Paragraph({
                                    alignment: core.AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        new core.TextRun({
                                            text: data.chuc_vu_phai || 'CHỦ TRÌ HỘI NGHỊ',
                                            font: core.LAYOUT.FONT, size: 28, bold: true,
                                        }),
                                    ],
                                }),
                                ...Array(4).fill(
                                    new core.Paragraph({
                                        spacing: { before: 0, after: 0 },
                                        children: [new core.TextRun({ text: '', size: 28 })],
                                    })
                                ),
                                new core.Paragraph({
                                    alignment: core.AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        new core.TextRun({
                                            text: data.chu_tri || '',
                                            font: core.LAYOUT.FONT, size: 28, bold: true,
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        })
    );

    // 6. Khối Thẩm quyền xác nhận (ở dưới cùng bên trái nếu có)
    if (data.xac_nhan && data.xac_nhan.quyen_han) {
        children.push(
            new core.Paragraph({ spacing: { before: 240, after: 0 }, children: [] })
        );

        const xacNhanLines = [];

        xacNhanLines.push(
            new core.Paragraph({
                alignment: core.AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
                children: [
                    new core.TextRun({
                        text: data.xac_nhan.quyen_han,
                        font: core.LAYOUT.FONT, size: 28, bold: true,
                    }),
                ],
            })
        );
        xacNhanLines.push(
            new core.Paragraph({
                alignment: core.AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
                children: [
                    new core.TextRun({
                        text: data.xac_nhan.chuc_vu || '',
                        font: core.LAYOUT.FONT, size: 28,
                    }),
                ],
            })
        );
        for (let i = 0; i < 4; i++) {
            xacNhanLines.push(
                new core.Paragraph({
                    spacing: { before: 0, after: 0 },
                    children: [new core.TextRun({ text: '', size: 28 })],
                })
            );
        }
        xacNhanLines.push(
            new core.Paragraph({
                alignment: core.AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
                children: [
                    new core.TextRun({
                        text: data.xac_nhan.nguoi_ky || '',
                        font: core.LAYOUT.FONT, size: 28, bold: true,
                    }),
                ],
            })
        );

        children.push(
            new core.Table({
                width: { size: core.LAYOUT.CONTENT_WIDTH, type: core.WidthType.DXA },
                borders: core.BORDERS_NONE,
                columnWidths: [4677, 4678],
                rows: [
                    new core.TableRow({
                        children: [
                            new core.TableCell({
                                borders: core.BORDERS_NONE,
                                width: { size: 4677, type: core.WidthType.DXA },
                                verticalAlign: core.VerticalAlign.TOP,
                                children: xacNhanLines,
                            }),
                            new core.TableCell({
                                borders: core.BORDERS_NONE,
                                width: { size: 4678, type: core.WidthType.DXA },
                                children: [],
                            })
                        ]
                    })
                ]
            })
        );
    }

    return core.createDocument(children);
}

export function generateDocx(data) {
    if (data.loai_van_ban === 'cong_van') {
        return generateCongVan(data);
    }
    if (data.loai_van_ban === 'bien_ban') {
        return generateBienBan(data);
    }
    return generateVbCoTenLoai(data);
}
