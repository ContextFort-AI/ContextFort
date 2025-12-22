// macOS OS-level input monitor using CGEventTap
// Captures real mouse clicks before they reach applications

#import <Foundation/Foundation.h>
#import <ApplicationServices/ApplicationServices.h>
#import <Carbon/Carbon.h>

// Callback function for click events
typedef void (*ClickCallback)(double timestamp, double x, double y, int button);

// Global callback pointer
static ClickCallback g_callback = NULL;

// Event tap callback
CGEventRef eventTapCallback(CGEventTapProxy proxy, CGEventType type,
                            CGEventRef event, void *refcon) {

    if (type == kCGEventLeftMouseDown ||
        type == kCGEventRightMouseDown ||
        type == kCGEventOtherMouseDown) {

        // Get click position
        CGPoint location = CGEventGetLocation(event);

        // Get timestamp as Unix epoch seconds (not nanoseconds since boot!)
        double timestamp_sec = [[NSDate date] timeIntervalSince1970];

        // Determine button (0=left, 1=middle, 2=right)
        int button = 0;
        if (type == kCGEventRightMouseDown) button = 2;
        else if (type == kCGEventOtherMouseDown) button = 1;

        // Call the callback if set
        if (g_callback) {
            g_callback(timestamp_sec, location.x, location.y, button);
        }

        // Log to STDOUT (not NSLog) so bridge.py can read it
        fprintf(stdout, "[OS Monitor] Click detected: x=%.1f, y=%.1f, button=%d, time=%.3f\n",
                location.x, location.y, button, timestamp_sec);
        fflush(stdout);  // Important: flush immediately
    }

    // Pass the event through (don't block it)
    return event;
}

// Start monitoring
int start_os_monitor(ClickCallback callback) {
    g_callback = callback;

    fprintf(stdout, "[OS Monitor] Starting macOS input monitor...\n");
    fflush(stdout);

    // Create event mask for mouse clicks
    CGEventMask eventMask =
        CGEventMaskBit(kCGEventLeftMouseDown) |
        CGEventMaskBit(kCGEventRightMouseDown) |
        CGEventMaskBit(kCGEventOtherMouseDown);

    // Create event tap
    CFMachPortRef eventTap = CGEventTapCreate(
        kCGSessionEventTap,                // Tap all events for current session
        kCGHeadInsertEventTap,            // Insert at head of event queue
        kCGEventTapOptionListenOnly,      // Don't modify events
        eventMask,
        eventTapCallback,
        NULL
    );

    if (!eventTap) {
        fprintf(stderr, "[OS Monitor] ERROR: Failed to create event tap!\n");
        fprintf(stderr, "[OS Monitor] Make sure app has Accessibility permissions:\n");
        fprintf(stderr, "[OS Monitor] System Preferences > Security & Privacy > Privacy > Accessibility\n");
        fflush(stderr);
        return -1;
    }

    // Create run loop source
    CFRunLoopSourceRef runLoopSource =
        CFMachPortCreateRunLoopSource(kCFAllocatorDefault, eventTap, 0);

    // Add to current run loop
    CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, kCFRunLoopCommonModes);

    // Enable the tap
    CGEventTapEnable(eventTap, true);

    fprintf(stdout, "[OS Monitor] Monitor started successfully\n");
    fflush(stdout);

    // Run the loop
    CFRunLoopRun();

    return 0;
}

// Check if we have accessibility permissions
int check_accessibility_permission() {
    NSDictionary *options = @{(__bridge id)kAXTrustedCheckOptionPrompt: @YES};
    Boolean trusted = AXIsProcessTrustedWithOptions((__bridge CFDictionaryRef)options);
    return trusted ? 1 : 0;
}

// Entry point for testing
#ifdef STANDALONE
void test_callback(double timestamp, double x, double y, int button) {
    printf("CLICK: x=%.1f, y=%.1f, button=%d, time=%.3f\n",
           x, y, button, timestamp);
}

int main(int argc, char *argv[]) {
    @autoreleasepool {
        NSLog(@"Testing macOS OS Monitor...");

        if (!check_accessibility_permission()) {
            NSLog(@"ERROR: Need accessibility permissions!");
            return 1;
        }

        NSLog(@"Starting monitor... Click anywhere to test.");
        start_os_monitor(test_callback);
    }
    return 0;
}
#endif
