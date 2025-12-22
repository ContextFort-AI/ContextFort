# Makefile for macOS OS monitor

FRAMEWORKS = -framework Foundation -framework ApplicationServices -framework Carbon
CFLAGS = -Wall -O2

# Build standalone test binary
macos_monitor_test: macos_monitor.m
	clang $(CFLAGS) -DSTANDALONE -o macos_monitor_test macos_monitor.m $(FRAMEWORKS)
	@echo ""
	@echo "Built: ./macos_monitor_test"
	@echo "Run: ./macos_monitor_test"
	@echo ""
	@echo "Note: You need to grant Accessibility permissions"
	@echo "System Preferences > Security & Privacy > Privacy > Accessibility"

# Build shared library for SDK integration
macos_monitor.dylib: macos_monitor.m
	clang $(CFLAGS) -dynamiclib -o macos_monitor.dylib macos_monitor.m $(FRAMEWORKS)

clean:
	rm -f macos_monitor_test macos_monitor.dylib

.PHONY: clean
