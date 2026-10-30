import AppKit

// cutout.swift <in.png> <out.png> <light|dark>
// Undoes Clive's canvas.swift: the flat ground and the black window shadow on it, reached from the
// edges inward, become transparent; the rest is cropped to what is left. A ground pixel is
// ground * (1 - a) for one shadow alpha a in every channel, which window pixels are not.

let args = CommandLine.arguments
let dark = args[3] == "dark"
let ground: [Double] = dark ? [0.055, 0.060, 0.075].map { $0 * 255 } : [0.910, 0.910, 0.925].map { $0 * 255 }
let tolerance = dark ? 0.12 : 0.012  // light ground is slightly blue; neutral window greys miss it

let source = NSImage(contentsOfFile: args[1])!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let w = source.width, h = source.height
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: CGColorSpace(name: CGColorSpace.sRGB)!,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(source, in: CGRect(x: 0, y: 0, width: w, height: h))
let px = ctx.data!.bindMemory(to: UInt8.self, capacity: w * h * 4)

func isGround(_ i: Int) -> Bool {
    let a = (0..<3).map { 1 - Double(px[i * 4 + $0]) / ground[$0] }
    guard let lo = a.min(), let hi = a.max() else { return false }
    // canvas.swift's shadow is black at 0.28 (0.6 dark), so anything darker is the window.
    return lo >= -tolerance && hi <= (dark ? 0.7 : 0.3) && hi - lo <= tolerance
}

var seen = [Bool](repeating: false, count: w * h)
var stack: [Int] = []
for x in 0..<w { stack.append(x); stack.append((h - 1) * w + x) }
for y in 0..<h { stack.append(y * w); stack.append(y * w + w - 1) }
while let i = stack.popLast() {
    if seen[i] || !isGround(i) { continue }
    seen[i] = true
    px[i * 4] = 0; px[i * 4 + 1] = 0; px[i * 4 + 2] = 0; px[i * 4 + 3] = 0
    let x = i % w, y = i / w
    if x > 0 { stack.append(i - 1) }
    if x < w - 1 { stack.append(i + 1) }
    if y > 0 { stack.append(i - w) }
    if y < h - 1 { stack.append(i + w) }
}

var minX = w, minY = h, maxX = 0, maxY = 0
for y in 0..<h { for x in 0..<w where px[(y * w + x) * 4 + 3] > 0 {
    minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y)
} }
// Memory row 0 is the top of the picture, as in the file.
let full = ctx.makeImage()!
let cropped = full.cropping(to: CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1))!
let rep = NSBitmapImageRep(cgImage: cropped)
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
print("\(args[2].split(separator: "/").last!) \(rep.pixelsWide)x\(rep.pixelsHigh)")
